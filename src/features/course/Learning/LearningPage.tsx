import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LearningTabs from "./LearningTabs";
import LearningVideo from "./LearningVideo";
import LearningSidebar from "./LearningSidebar";
import LearningFooter from "./LearningFooter";
import { getCourseDetailBySlug, getSections, getLectures } from "../api";
import OverviewTab from "./OverviewTab";
import NoteTab from "./NoteTab";
import ReviewPage from "./ReviewTag";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CodingExerciseTab from "./CodingTag";


const LearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, any[]>>({});
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const courseData = await getCourseDetailBySlug(slug);
      setCourse(courseData);

      const sectionsData = await getSections(courseData.courseId);
      setSections(sectionsData);

      // Lấy lectures cho từng section
      const lecturesObj: Record<string, any[]> = {};
      for (const section of sectionsData) {
        const lectures = await getLectures(section.sectionId);
        lecturesObj[section.sectionId] = lectures;
      }
      setLecturesMap(lecturesObj);

      // Chọn bài giảng đầu tiên
      const firstLecture = Object.values(lecturesObj)[0]?.[0];
      if (firstLecture) setCurrentLecture(firstLecture);
    }
    fetchData();
  }, [slug]);

  const handleSelectLecture = (lectureId: string) => {
    for (const lectures of Object.values(lecturesMap)) {
      const found = lectures.find((l: any) => l.lectureId === lectureId);
      if (found) {
        setCurrentLecture(found);
        break;
      }
    }
  };

  if (!course) return <div>Đang tải khóa học...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LearningHeader title={course.title} />
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 mr-80"> {/* mr-80 để chừa chỗ cho sidebar */}
          <LearningVideo videoUrl={currentLecture?.videoUrl} />
          <LearningTabs active={activeTab} setActive={setActiveTab} />
          <div className="mt-4 px-4">
            {activeTab === "Tổng quan" && <OverviewTab slug={slug!} />}
            {activeTab === "Ghi chú" && currentLecture && userId && (
              <NoteTab lectureId={currentLecture.lectureId!} userId={userId} />
            )}
            {activeTab === "Thông báo" && <div>Chưa có thông báo nào.</div>}
            {activeTab === "Đánh giá" && <ReviewPage />}
            {activeTab === "Coding Exercise" && <CodingExerciseTab />}
          </div>
          <LearningFooter />
        </main>
        <LearningSidebar
          sections={sections}
          lecturesMap={lecturesMap}
          currentLectureId={currentLecture?.lectureId}
          onSelectLecture={handleSelectLecture}
        />
      </div>
    </div>
  );
};

export default LearningPage;