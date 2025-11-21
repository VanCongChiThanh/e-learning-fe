import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "./student/EnrollmentLearn";
import SessionListPage from "./student/SessionListPage";
import LectureListPage from "./student/LectureListPage";
// import ProgressPage from "./student/ProgressPage";
import QuizTakingPage from "./student/QuizTakingPage";
import QuizResultPage from "./student/QuizResultPage";
import EnrollmentInstructor from "./teacher/EnrollmentInstructor";
import CourseDetailInstructor from "./teacher/CourseDetailInstructor";
import CourseQuizManagement from "./teacher/CourseQuizManagement";
import QuizCreateWithQuestions from "./teacher/QuizCreateWithQuestions";
import CourseStudentList from "./teacher/CourseStudentList";
import StudentProgressDetail from "./teacher/StudentProgressDetail";
// import QuizQuestionManagementPage from "./teacher/QuizQuestionManagementPage";
import QuizStatisticsPage from "./teacher/QuizStatisticsPage";
export const LearnRoutes = [
  // {
  //   path: "/learn/sessions/:enrollmentId/:courseId",
  //   element: (
  //     <ProtectedRoute roles={["LEARNER"]}>
  //       <MainLayout>
  //         <SessionListPage />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/learn/lectures/:enrollmentId/:courseId/:sessionId",
  //   element: (
  //     <ProtectedRoute roles={["LEARNER"]}>
  //       <MainLayout>
  //         <LectureListPage />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/learn/progress/:enrollmentId/:courseId/:sessionId/:lectureId",
  //   element: (
  //     <ProtectedRoute roles={["LEARNER"]}>
  //       <MainLayout>
  //         <ProgressPage />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  // http://localhost:3000/learn/quiz/5baf95c6-db09-4012-913e-1b85803fe8b9/540fc1be-d60e-4fe7-a270-c9b04a1c8720

  {
    path: "/learn/quiz/:quizId/:enrollmentId",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <QuizTakingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/learn/quiz/:quizId/:enrollmentId/result/:submissionId",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <QuizResultPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/enrollments",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EnrollmentInstructor />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/course/:courseId",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <CourseDetailInstructor />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/course/:courseId/students",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <CourseStudentList />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // xem laij cos can hay ko
  {
    path: "/teacher/course/:courseId/student/:studentId/progress",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <StudentProgressDetail />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // chua hien thi bao cao
  {
    path: "/teacher/course/:courseId/quizzes",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <CourseQuizManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/course/:courseId/quiz/create/:lectureId",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <QuizCreateWithQuestions />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/teacher/course/:courseId/quiz/:quizId/questions",
  //   element: (
  //     <ProtectedRoute roles={["INSTRUCTOR"]}>
  //       <MainLayout>
  //         <QuizQuestionManagementPage />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/teacher/course/:courseId/quiz/:quizId/statistics",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <QuizStatisticsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];

// 1. CourseQuizmanager-- > chưa hiển thị báo cáo quiz
// 3. QuizQuestionManagementPage-- > chưa dùng
// 4. LearnRoutes có nhiều route chưa dùng đến, cần xem lại có cần thiết không-- AI tạo
// 5. Test tạo quiz với question rồi xóa quiz xem có bị lỗi ko
// 6. Sửa chỗ QuizCard cho phù hợp
