import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LearningTabs from "./LearningTabs";
import LearningVideo, { TimeTrigger, ProgressState } from "./LearningVideo";
import LearningSidebar from "./LearningSidebar";
import LearningFooter from "./LearningFooter";
import { getCourseDetailBySlug, getSections, getLectures, getEventsForLecture, getCodeExerciseDetail, getQuizDetail, QuizDetail, getMyEnrollmentForCourse, getQuizzesByLecture, updateLectureProgress } from "../api";
import OverviewTab from "./OverviewTab";
import NoteTab from "./NoteTab";
import ReviewTag from "./ReviewTag";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CodingExerciseTab from "./CodingTag";
import CodeExercise from "./CodeExercise";
import EventNotification from "./EventNotification";
import EventTab, { StoredEvent } from "./EventTag";
import QuizTab from "./QuizTag";
import CodePage from "./CodePage";

const FullScreenModal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#111827', // bg-gray-900
      zIndex: 50, // Đè lên trên mọi thứ
      overflow: 'auto'
    }}>
      {children}
    </div>
  );
};


const LearningPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, any[]>>({});
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [videoTriggers, setVideoTriggers] = useState<TimeTrigger[]>([]);
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);


  // State mới để theo dõi các section đang tải
  const [loadingSections, setLoadingSections] = useState<Set<string>>(new Set());


  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationContent, setNotificationContent] = useState<{ title: string; exerciseId: string | null }>({ title: '', exerciseId: null });

  const [storedEvents, setStoredEvents] = useState<StoredEvent[]>([]);

  const [codeNotificationVisible, setCodeNotificationVisible] = useState(false);
  const [codeNotificationContent, setCodeNotificationContent] = useState<{ title: string; exerciseId: string | null }>({ title: '', exerciseId: null });

  const [quizNotificationVisible, setQuizNotificationVisible] = useState(false);
  const [quizNotificationContent, setQuizNotificationContent] = useState<{ title: string; quizId: string | null }>({ title: '', quizId: null });

  const [modalExerciseId, setModalExerciseId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);



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

        // Lấy enrollmentId sau khi có courseId
        if (courseData.courseId) {
          const enrollmentData = await getMyEnrollmentForCourse(courseData.courseId);
          setEnrollmentId(enrollmentData.enrollmentId);
        }
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
  const handleVideoEvent = async (action: string, type?: string) => {
    console.log(`Event triggered! Type: ${type}, Payload (quizId): ${action}`);
    const addEventToList = (newEvent: Omit<StoredEvent, 'id' | 'timestamp'>) => {
      setStoredEvents(prevEvents => {
        const eventId = `${newEvent.type}-${newEvent.payload}-${Date.now()}`;
        // Tránh thêm sự kiện trùng lặp quá nhanh
        if (prevEvents.some(e => e.payload === newEvent.payload && e.type === newEvent.type)) {
          console.log("Sự kiện đã tồn tại, không thêm lại.");
          return prevEvents;
        }
        return [...prevEvents, { ...newEvent, id: eventId, timestamp: new Date() }];
      });
    };
    if (type === 'CODE') {
      try {
        // Hiển thị thông báo với trạng thái đang tải
        setCodeNotificationContent({ title: "Đang tải đề bài...", exerciseId: null });
        setCodeNotificationVisible(true);
        

        // Gọi API để lấy chi tiết bài tập
        const exerciseDetails = await getCodeExerciseDetail(action); // action chính là exerciseId

        // Cập nhật nội dung thông báo với title thực tế
        setCodeNotificationContent({
          title: exerciseDetails.title,
          exerciseId: exerciseDetails.id,
        });
        addEventToList({
          type: 'CODE',
          payload: exerciseDetails.id,
          title: exerciseDetails.title,
        });

      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài tập từ event:", error);
        // Ẩn thông báo nếu có lỗi
        setNotificationVisible(false);
      }

    } else if (type === 'QUIZ') {
      try {
        // Logic cho QUIZ vẫn có thể giữ lại alert hoặc nâng cấp sau
        // alert(`Đã đến lúc làm bài tập trắc nghiệm!`);
        setNotificationContent({ title: "Đang tải đề bài...", exerciseId: null });
        setQuizNotificationVisible(true);
        const quizDetails: QuizDetail = await getQuizDetail(action);
        setQuizNotificationContent({ title: quizDetails.title, quizId: quizDetails.id });
        setStoredEvents(prev => [...prev, {
          id: `QUIZ-${quizDetails.id}-${Date.now()}`,
          type: 'QUIZ',
          payload: quizDetails.id,
          title: quizDetails.title,
          timestamp: new Date()
        }]);

      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài kiểm tra từ event:", error);
        setQuizNotificationVisible(false);
      }



    }

  };

  // Hàm để nhận tiến trình video từ component con
  const handleVideoProgress = (progress: ProgressState) => {
    setCurrentTime(progress.playedSeconds);
  };

  // Hàm format thời gian sang hh:mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Gửi tiến độ xem video định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId && currentLecture?.lectureId && currentTime > 0) {
        const payload = {
          userId: userId,
          lectureId: currentLecture.lectureId,
          lastViewAt: formatTime(currentTime)
        };
        console.log("Updating progress:", payload);
        updateLectureProgress(payload).catch(err => {
          console.error("Failed to update lecture progress:", err);
        });
      }
    }, 15000); // Gửi mỗi 15 giây

    return () => clearInterval(interval);
  }, [currentTime, currentLecture, userId]);


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
  const handleQuizNotificationClick = () => {
    // Khi click vào thông báo quiz, chuyển sang tab Quiz
    setActiveTab("Quiz");
  };

  const handleCodeNotificationClick = () => {
    // Kiểm tra xem đã có ID bài tập trong state thông báo chưa
    if (codeNotificationContent.exerciseId) {
      // Đặt ID cho modal để mở nó
      setModalExerciseId(codeNotificationContent.exerciseId);
      // EventNotification sẽ tự động đóng khi được click
    }
  };

  const handleSelectQuizEvent = (quizId: string) => {
    if (enrollmentId) {
      navigate(`/learn/quiz/${quizId}/${enrollmentId}`);
    } else {
      alert("Không tìm thấy thông tin đăng ký khóa học để bắt đầu bài quiz.");
    }
  };



  if (!course) return <div>Đang tải khóa học...</div>;

  return (
    <>
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
              onProgress={handleVideoProgress}
            />
            <LearningTabs active={activeTab} setActive={setActiveTab} />
            <div className="mt-4 px-4">
              {activeTab === "Tổng quan" && <OverviewTab slug={slug!} />}
              {activeTab === "Ghi chú" && currentLecture && userId && (
                <NoteTab lectureId={currentLecture.lectureId!} userId={userId} />
              )}
              {activeTab === "Thông báo" && <div>Chưa có thông báo nào.</div>}
              {activeTab === "Đánh giá" && <ReviewTag courseId={course.courseId} />}
              {activeTab === "Coding Exercise" && currentLecture && (
                <CodingExerciseTab
                  lectureId={currentLecture.lectureId!}
                  onSelectExercise={setModalExerciseId} // THÊM: Truyền hàm set state
                />
              )}
              {activeTab === "Quiz" && (
                currentLecture && (
                  <QuizTab 
                    lectureId={currentLecture.lectureId} 
                    enrollmentId={enrollmentId} 
                  />)
              )}
              {activeTab === "Sự kiện" && (
              <EventTab 
                events={storedEvents} 
                onSelectCodeEvent={setModalExerciseId}
                onSelectQuizEvent={handleSelectQuizEvent} // THÊM DÒNG NÀY
              />
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
        <EventNotification
          isVisible={codeNotificationVisible}
          title={codeNotificationContent.title}
          message="Có bài tập lập trình mới!"
          // Truyền link vào prop linkTo
          // linkTo={codeNotificationContent.exerciseId ? `/code-exercise/${codeNotificationContent.exerciseId}` : undefined}
          onClick={handleCodeNotificationClick}
          onClose={() => setCodeNotificationVisible(false)}
        />
        <EventNotification
          isVisible={quizNotificationVisible}
          title={quizNotificationContent.title}
          message="Có bài kiểm tra mới!"
          // Truyền hàm xử lý vào prop onClick
          onClick={handleQuizNotificationClick}
          onClose={() => setQuizNotificationVisible(false)}
        />
      </div>
      {modalExerciseId && (
        <FullScreenModal>
          <CodePage
            exerciseId={modalExerciseId}
            onClose={() => setModalExerciseId(null)} // Hàm để đóng Modal
          />
        </FullScreenModal>
      )}
    </>
  );
};

export default LearningPage;