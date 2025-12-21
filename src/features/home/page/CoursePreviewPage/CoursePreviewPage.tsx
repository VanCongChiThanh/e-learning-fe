import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { getCourseDetailBySlug, getSectionsByCourseId } from "../../api";
import { checkEnrollment } from "../../../course/api";
import MainLayout from "../../../../layouts/MainLayout";
import { CourseResponse, SectionResponse } from "./types";
import CourseHeader from "./components/CourseHeader";
import CourseContent from "./components/CourseContent";
import CourseSidebar from "./components/CourseSidebar";
import CourseReviews from "./components/CourseReviews";
import InstructorSection from "./components/InstructorSection";
import RelatedCourses from "./components/RelatedCourses";
import "./CoursePreviewPage.scss";

export default function CoursePreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const [courseData, sectionsData] = await Promise.all([
          getCourseDetailBySlug(slug),
          // We'll get courseId from courseData first
          Promise.resolve([]),
        ]);

        setCourse(courseData);

        // Kiểm tra enrollment nếu đã đăng nhập
        if (token && courseData.courseId) {
          const isEnrolled = await checkEnrollment(courseData.courseId);
          if (isEnrolled) {
            // Nếu đã đăng ký, redirect đến trang learning
            navigate(`/learning/${slug}`, { replace: true });
            return;
          }
        }

        // Fetch sections with courseId
        if (courseData.courseId) {
          const sectionsResponse = await getSectionsByCourseId(
            courseData.courseId
          );
          setSections(sectionsResponse);
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug, token, navigate]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="course-preview-page">
          <div className="course-preview-loading">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải thông tin khóa học...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="course-preview-error">
          <h2>Không tìm thấy khóa học</h2>
          <p>Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="course-preview-page">
        {/* Hero Section - Dark background like Udemy */}
        <CourseHeader course={course} />

        {/* Main Content - Two Column Layout */}
        <div className="course-main">
          {/* Left Column - Course Info */}
          <div className="course-content-main">
            <CourseContent
              course={course}
              sections={sections}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />

            <InstructorSection
              instructorId={course.instructorId}
              instructorName={course.instructorName}
            />

            <CourseReviews
              courseId={course.courseId}
              averageRating={course.averageRating}
              totalReviews={course.totalReviews}
            />
          </div>

          {/* Right Column - Sticky Sidebar */}
          <CourseSidebar course={course} sections={sections} />
        </div>

        {/* Related Courses - Full Width */}
        <RelatedCourses courseId={course.courseId} category={course.category} />
      </div>
    </MainLayout>
  );
}
