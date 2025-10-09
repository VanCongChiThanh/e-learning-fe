import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "./student/EnrollmentLearn";
import SessionListPage from "./student/SessionListPage";
import LectureListPage from "./student/LectureListPage";
import ProgressPage from "./student/ProgressPage";
import EnrollmentInstructor from "./teacher/EnrollmentInstructor";
// import { QuizAssignmentStudent } from "./student/QuizAssignmentStudent";
import { QuizAssignmentInstructor } from "./teacher/QuizAssignmentInstructor";

export const LearnRoutes = [
  {
    path: "/learn/enrollments",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <EnrollmentLearn />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learn/sessions/:enrollmentId/:courseId",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <SessionListPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learn/lectures/:enrollmentId/:courseId/:sessionId",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <LectureListPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learn/progress/:enrollmentId/:courseId/:sessionId/:lectureId",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <ProgressPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  
  // {
  //   path: "/learn/quiz-assignments",
  //   element: (
  //     <ProtectedRoute roles={["LEARNER"]}>
  //       <MainLayout>
  //         <QuizAssignmentStudent />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/teacher/enrollments",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EnrollmentInstructor  />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/quiz-assignments",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <QuizAssignmentInstructor />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
]