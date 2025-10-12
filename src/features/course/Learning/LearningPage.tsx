import React, { useEffect, useState, useCallback  } from "react";
import { useParams } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LearningTabs from "./LearningTabs";
import LearningVideo, { TimeTrigger } from "./LearningVideo";
import LearningSidebar from "./LearningSidebar";
import LearningFooter from "./LearningFooter";
import { getCourseDetailBySlug, getSections, getLectures, getEventsForLecture  } from "../api";
import OverviewTab from "./OverviewTab";
import NoteTab from "./NoteTab";
import ReviewPage from "./ReviewTag";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CodingExerciseTab from "./CodingTag";
import QuizTab from "./QuizTag"; 




const LearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, any[]>>({});
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [videoTriggers, setVideoTriggers] = useState<TimeTrigger[]>([]);
  

  // State mới để theo dõi các section đang tải
  const [loadingSections, setLoadingSections] = useState<Set<string>>(new Set());
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  

  // Tải dữ liệu ban đầu cho khóa học và các section
  useEffect(() => {
    async function fetchCourseAndSections() {
      if (!slug) return;
      try {
        const courseData = await getCourseDetailBySlug(slug);
        setCourse(courseData);

        const sectionsData = await getSections(courseData.courseId);
        // Sắp xếp các section theo position trước khi set state
        const sortedSections = [...sectionsData].sort((a, b) => a.position - b.position);
        setSections(sortedSections);
      } catch (error) {
        console.error("Lỗi khi tải khóa học hoặc section:", error);
      }
    }
    fetchCourseAndSections();
  }, [slug]);
  // Reset triggers mỗi khi đổi bài giảng mới
    useEffect(() => {
    if (currentLecture?.lectureId) {
      const fetchEvents = async () => {
        try {
          // Lấy toàn bộ response từ API
          const response = await getEventsForLecture(currentLecture.lectureId);
          
          // --- SỬA LỖI Ở ĐÂY ---
          // Kiểm tra xem response.data có phải là một mảng hay không
          if (response && Array.isArray(response.data)) {
            // Gọi .map() trên mảng response.data
            const newTriggers: TimeTrigger[] = response.data.map((event: any) => ({
              time: event.triggerTime,
              action: event.payload,
              triggered: false,
              type: event.eventType,
            }));
            setVideoTriggers(newTriggers);
            console.log("Đã tải thành công triggers:", newTriggers); // Thêm log để kiểm tra
          } else {
            console.warn("API không trả về mảng event hợp lệ trong thuộc tính 'data'");
            setVideoTriggers([]);
          }

        } catch (error) {
          console.error("Lỗi khi tải events:", error);
          setVideoTriggers([]); // Reset nếu có lỗi
        }
      };

      fetchEvents();
    }
  }, [currentLecture]);
  // Hàm xử lý sự kiện được gửi từ LearningVideo
  const handleVideoEvent = (action: string, type?: string) => {
    console.log(`Event triggered! Type: ${type}, Payload (quizId): ${action}`);
    if (type === 'QUIZ') {
      alert(`Đã đến lúc làm bài tập! Nội dung sẽ xuất hiện ở tab "Quiz".`);
      setActiveQuizId(action); // Lưu lại quizId
      setActiveTab("Quiz");   // Tự động chuyển tab
    }
  };


  // Hàm để tải lecture cho một section cụ thể
  const fetchLecturesForSection = useCallback(async (sectionId: string) => {
    // Kiểm tra nếu đã có dữ liệu hoặc đang tải thì không gọi lại
    if (lecturesMap[sectionId] || loadingSections.has(sectionId)) {
      return;
    }

    try {
      // Bắt đầu tải
      setLoadingSections(prev => new Set(prev).add(sectionId));

      const lectures = await getLectures(sectionId);
      // Sắp xếp lecture theo position
      const sortedLectures = [...lectures].sort((a, b) => a.position - b.position);
      
      setLecturesMap(prevMap => ({
        ...prevMap,
        [sectionId]: sortedLectures,
      }));

      return sortedLectures; // Trả về để sử dụng nếu cần
    } catch (error) {
      console.error(`Lỗi khi tải lecture cho section ${sectionId}:`, error);
    } finally {
      // Kết thúc tải
      setLoadingSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionId);
        return newSet;
      });
    }
  }, [lecturesMap, loadingSections]); // Thêm dependencies


  // Tự động tải lecture cho section đầu tiên và chọn bài giảng đầu tiên
  useEffect(() => {
    if (sections.length > 0) {
      const firstSectionId = sections[0].sectionId;
      // Chỉ tải nếu chưa có dữ liệu
      if (!lecturesMap[firstSectionId]) {
        fetchLecturesForSection(firstSectionId).then(firstLectures => {
          if (firstLectures && firstLectures.length > 0) {
            setCurrentLecture(firstLectures[0]);
          }
        });
      }
    }
  }, [sections, fetchLecturesForSection, lecturesMap]);
  const handleSelectLecture = (lectureId: string) => {
    for (const lectures of Object.values(lecturesMap)) {
      const found = lectures.find((l: any) => l.lectureId === lectureId);
      if (found) {
        setCurrentLecture(found);
        break;
      }
    }
  };
  // Hàm này sẽ được gọi từ Sidebar khi người dùng nhấn vào một section
  const handleToggleSection = (sectionId: string) => {
    fetchLecturesForSection(sectionId);
  };

  if (!course) return <div>Đang tải khóa học...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LearningHeader title={course.title} />
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 mr-80"> {/* mr-80 để chừa chỗ cho sidebar */}
          <LearningVideo
            videoUrl={currentLecture?.videoUrl}
            triggers={videoTriggers}
            onTimeTrigger={handleVideoEvent}
            setTriggers={setVideoTriggers}
          />
          <LearningTabs active={activeTab} setActive={setActiveTab} />
          <div className="mt-4 px-4">
            {activeTab === "Tổng quan" && <OverviewTab slug={slug!} />}
            {activeTab === "Ghi chú" && currentLecture && userId && (
              <NoteTab lectureId={currentLecture.lectureId!} userId={userId} />
            )}
            {activeTab === "Thông báo" && <div>Chưa có thông báo nào.</div>}
            {activeTab === "Đánh giá" && <ReviewPage />}
            {activeTab === "Coding Exercise" && <CodingExerciseTab />}
            {activeTab === "Quiz" && (
              activeQuizId ? (
                <QuizTab quizId={activeQuizId} />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <p>Chưa có bài tập nào được kích hoạt. Hãy tiếp tục xem video nhé!</p>
                </div>
              )
            )}
          </div>
          <LearningFooter />
        </main>
        <LearningSidebar
          sections={sections}
          lecturesMap={lecturesMap}
          currentLectureId={currentLecture?.lectureId}
          onSelectLecture={handleSelectLecture}
          // Prop mới để xử lý việc tải và hiển thị
          onToggleSection={handleToggleSection}
          loadingSections={loadingSections}
        />
      </div>
    </div>
  );
};

export default LearningPage;