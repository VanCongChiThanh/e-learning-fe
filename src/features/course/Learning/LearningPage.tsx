import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LearningTabs from "./LearningTabs";
import LearningVideo, { TimeTrigger, ProgressState, Lecture as LearningVideoLecture } from "./LearningVideo"; // Đổi tên Lecture để tránh xung đột
import LearningSidebar from "./LearningSidebar";
import LearningFooter from "./LearningFooter";
import { getCourseDetailBySlug, getSections, getLectures, getEventsForLecture, getCodeExerciseDetail, getQuizDetail, QuizDetail, getMyEnrollmentForCourse, getQuizzesByLecture, updateLectureProgress, getRecentLearning, RecentLearningInfo } from "../api";
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
import { Section } from "./LearningSidebar"; // Import Section từ LearningSidebar
import CodePage from "./CodePage";
import DiscussionTab from "./DiscussionTab";
import ReviewModal from "./ReviewModal";

// Định nghĩa lại interface Lecture để bao gồm videoUrl và các thuộc tính khác
interface LectureData {
  lectureId: string;
  title: string;
  position: number;
  videoUrl: string; // Thêm videoUrl vì nó được sử dụng trong LearningVideo
}

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

// Component cho thông báo "Tiếp tục xem"
const ContinueWatchingNotification: React.FC<{
  lectureTitle: string;
  onContinue: () => void;
  onDecline: () => void;
}> = ({ lectureTitle, onContinue, onDecline }) => {
  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm z-50 bg-white rounded-lg shadow-2xl p-4 transition-all duration-500 ease-in-out">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <i className="fas fa-play-circle text-blue-500 text-xl"></i>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">Tiếp tục xem?</p>
          <p className="mt-1 text-sm text-gray-700 truncate">Bạn đang xem dở bài: {lectureTitle}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3 justify-end">
        <button onClick={onDecline} className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
          Bắt đầu lại
        </button>
        <button onClick={onContinue} className="px-3 py-1.5 bg-[#106c54] text-white rounded-md text-sm font-medium hover:bg-[#0d5a45]">
          Tiếp tục
        </button>
      </div>
    </div>
  );
};


const LearningPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null); // Course detail type can be more specific if defined
  const [sections, setSections] = useState<Section[]>([]); // Sử dụng type Section đã import
  const [lecturesMap, setLecturesMap] = useState<Record<string, LectureData[]>>({}); // Sử dụng LectureData
  const [currentLecture, setCurrentLecture] = useState<LectureData | null>(null); // Sử dụng LectureData
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [videoTriggers, setVideoTriggers] = useState<TimeTrigger[]>([]);
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const [enrollmentId, setEnrollmentId] = useState<string | null | undefined>(undefined); // undefined: chưa xác định, null: không có, string: có


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
  const currentTimeRef = useRef(0);
  const [initialLectureLoaded, setInitialLectureLoaded] = useState(false);
  const initialLectureLoadAttempted = useRef(false); // Dùng ref để đảm bảo chỉ chạy một lần
  const [initialSeekTime, setInitialSeekTime] = useState(0);
  const [recentLearningInfo, setRecentLearningInfo] = useState<RecentLearningInfo | null>(null);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);



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

        let fetchedEnrollmentId: string | null = null;
        if (courseData.courseId&&userId) {
          try {
            const enrollmentData = await getMyEnrollmentForCourse(userId , courseData.courseId);
            fetchedEnrollmentId = enrollmentData.enrollmentId;
          } catch (enrollmentError) {
            console.warn("Không tìm thấy enrollment cho khóa học này hoặc lỗi:", enrollmentError);
            fetchedEnrollmentId = null; // Explicitly set to null if not found
          }
        }
        setEnrollmentId(fetchedEnrollmentId); 
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
            // Gọi .map() trên mảng response.data và đảm bảo type
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
    currentTimeRef.current = progress.playedSeconds;
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

  // Hàm chuyển đổi hh:mm:ss sang giây
  const timeToSeconds = (timeStr: string): number => {
    // LOG: Kiểm tra chuỗi thời gian đầu vào
    console.log(`[timeToSeconds] Input time string: "${timeStr}"`);
    if (!timeStr || typeof timeStr !== 'string') {
      console.log('[timeToSeconds] Invalid input, returning 0');
      return 0;
    }
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      const seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      // LOG: Kiểm tra kết quả chuyển đổi
      console.log(`[timeToSeconds] Converted to ${seconds} seconds.`);
      return seconds;
    }
    console.log('[timeToSeconds] String format is not hh:mm:ss, returning 0');
    return 0;
  };

  // Gửi tiến độ xem video định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId && currentLecture?.lectureId && currentTimeRef.current > 0) {
        const payload = {
          userId: userId,
          lectureId: currentLecture.lectureId,
          lastViewAt: formatTime(currentTimeRef.current)
        };
        console.log("Updating progress:", payload);
        updateLectureProgress(payload).catch(err => {
          console.error("Failed to update lecture progress:", err);
        });
      }
    }, 15000); // Gửi mỗi 15 giây

    return () => clearInterval(interval);
  }, [currentLecture, userId]);


  // Hàm để tải lecture cho một section cụ thể
  const fetchLecturesForSection = useCallback(async (sectionId: string) => {
    // Kiểm tra nếu đã có dữ liệu hoặc đang tải thì không gọi lại
    if (lecturesMap[sectionId] || loadingSections.has(sectionId)) {
      return;
    }

    try {
      // Bắt đầu tải
      setLoadingSections(prev => new Set(prev).add(sectionId));

      const lectures: LectureData[] = await getLectures(sectionId); // Cast to LectureData[]
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


  // Tải bài giảng gần nhất hoặc bài đầu tiên
  useEffect(() => {
    // Điều kiện 1: Phải có sections đã được tải
    if (sections.length === 0) {
      return;
    }

    // Điều kiện 2: enrollmentId phải được xác định (không còn là undefined ban đầu)
    // Nó có thể là string (đã enroll) hoặc null (chưa enroll/lỗi). undefined là trạng thái đang fetch.
    if (enrollmentId === undefined) {
      return;
    }

    // Điều kiện 3: Đảm bảo logic này chỉ chạy một lần cho lần tải trang ban đầu
    if (initialLectureLoadAttempted.current) {
      return;
    }
    initialLectureLoadAttempted.current = true; 

    const loadAndSetInitialLecture = async () => {
      let lectureToSet: LectureData | null = null;
      let seekTime = 0;

      if (enrollmentId) { // Người dùng đã enroll, thử lấy bài giảng gần nhất (enrollmentId là string)
        console.log("Đang gọi getRecentLearning với enrollmentId:", enrollmentId);
        try {
          const recentInfo: RecentLearningInfo = await getRecentLearning(enrollmentId);
          console.log("Tìm thấy bài giảng gần nhất:", recentInfo);
          // Thay vì set lecture, hiển thị modal
          setRecentLearningInfo(recentInfo);
          if (recentInfo.enrollmentProgressPercentage != 0.0) {
             setShowContinueModal(true);
          }

          const lectures = await fetchLecturesForSection(recentInfo.sectionId);
          const foundRecentLecture = lectures?.find(l => l.lectureId === recentInfo.lectureId);
          if (foundRecentLecture) {
            lectureToSet = { ...foundRecentLecture, videoUrl: recentInfo.lectureVideoUrl };
          } else {
            console.warn("Bài giảng gần nhất không tìm thấy trong danh sách, tải bài đầu tiên của section.");
            lectureToSet = lectures?.[0] || null;
          }
        } catch (error) {
          console.error("Lỗi khi tải bài giảng gần nhất:", error);
          console.log("Lỗi API khi tải bài giảng gần nhất, tải bài đầu tiên của khóa học.");
          // Fallback về bài giảng đầu tiên của khóa học nếu API lỗi
          const firstSectionId = sections[0].sectionId;
          const firstLectures = await fetchLecturesForSection(firstSectionId);
          lectureToSet = firstLectures?.[0] || null;
        }
      } else { // enrollmentId là null (người dùng chưa enroll hoặc chưa đăng nhập), tải bài giảng đầu tiên
        console.log("Không có enrollmentId, tải bài đầu tiên của khóa học.");
        // Tải bài giảng đầu tiên của khóa học
        const firstSectionId = sections[0].sectionId;
        try {
          fetchLecturesForSection(firstSectionId).then(firstLectures => {
            lectureToSet = firstLectures?.[0] || null;
          });
        } catch (error) {
          console.error("Lỗi khi tải bài giảng đầu tiên:", error);
        }

      }

      if (lectureToSet) {
        setCurrentLecture(lectureToSet);
        setInitialSeekTime(seekTime);
      }
    };

    loadAndSetInitialLecture(); // Gọi hàm async
  }, [enrollmentId, sections, fetchLecturesForSection]);

  const handleContinueLearning = async () => {
    if (!recentLearningInfo) return;

    // LOG: Kiểm tra thông tin khi nhấn nút "Tiếp tục"
    console.log('%c[handleContinueLearning] User clicked "Continue"', 'color: #28a745; font-weight: bold;');
    console.log('[handleContinueLearning] Recent Info:', recentLearningInfo);

    // **QUAN TRỌNG**: Set thời gian tua trước
    const newSeekTime = timeToSeconds(recentLearningInfo.lastViewedAt);

    // Tải lectures của section chứa bài xem dở nếu chưa có
    const lectures = lecturesMap[recentLearningInfo.sectionId] || await fetchLecturesForSection(recentLearningInfo.sectionId);
    const recentLecture = lectures?.find(l => l.lectureId === recentLearningInfo.lectureId);

    if (recentLecture) {
      // Cập nhật cả hai state cùng lúc để React xử lý trong một lần render
      // Điều này giúp `key` và `startTime` của LearningVideo được cập nhật đồng thời.
      React.startTransition(() => {
        setInitialSeekTime(newSeekTime);
        setCurrentLecture({ ...recentLecture, videoUrl: recentLearningInfo.lectureVideoUrl });
      });
    }
    setShowContinueModal(false); // Ẩn thông báo
  };

  const handleDeclineContinue = () => {
    setShowContinueModal(false); // Chỉ cần ẩn thông báo
  };

  const handleSelectLecture = (lectureId: string) => {
    for (const lectures of Object.values(lecturesMap)) {
      const found = lectures.find((l: LectureData) => l.lectureId === lectureId); // Sử dụng LectureData
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
        <LearningHeader 
          title={course.title} 
          courseId={course.courseId}
          enrollmentId={enrollmentId}
          onOpenReviewModal={() => setShowReviewModal(true)}
          refreshTrigger={reviewRefreshTrigger}
        />
        <div className="flex flex-1">
          {/* Main Content */}
          <main className="flex-1 mr-80"> {/* mr-80 để chừa chỗ cho sidebar */}
            <LearningVideo
              key={currentLecture?.lectureId || 'no-lecture'} // **FIX: Thêm key để reset component**
              videoUrl={currentLecture?.videoUrl}
              triggers={videoTriggers}
              onTimeTrigger={handleVideoEvent}
              setTriggers={setVideoTriggers}
              onProgress={handleVideoProgress}
              startTime={initialSeekTime} // Truyền thời gian bắt đầu
            />
            <LearningTabs active={activeTab} setActive={setActiveTab} />
            <div className="mt-4 px-4">
              {activeTab === "Tổng quan" && <OverviewTab slug={slug!} />}
              {activeTab === "Ghi chú" && currentLecture && userId && (
                <NoteTab lectureId={currentLecture.lectureId!} userId={userId} />
              )}
              {activeTab === "Thông báo" && <div>Chưa có thông báo nào.</div>}
              {activeTab === "Thảo luận" && currentLecture && (
                <DiscussionTab lectureId={currentLecture.lectureId} />
              )}
              {activeTab === "Đánh giá" && <ReviewTag courseId={course.courseId} refreshTrigger={reviewRefreshTrigger} />}
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
        {showContinueModal && recentLearningInfo && (
          <ContinueWatchingNotification
            lectureTitle={recentLearningInfo.lectureTitle}
            onContinue={handleContinueLearning}
            onDecline={handleDeclineContinue}
          />
        )}
      </div>
      {modalExerciseId && (
        <FullScreenModal>
          <CodePage
            exerciseId={modalExerciseId}
            onClose={() => setModalExerciseId(null)} // Hàm để đóng Modal
          />
        </FullScreenModal>
      )}
      {showReviewModal && (
        <FullScreenModal>
          <div className="flex items-center justify-center min-h-screen p-4">
            <ReviewModal 
              courseId={course.courseId} 
              onClose={() => setShowReviewModal(false)} 
              onSuccess={() => {
                setReviewRefreshTrigger(prev => prev + 1);
              }}
            />
          </div>
        </FullScreenModal>
      )}
    </>
  );
};

export default LearningPage;