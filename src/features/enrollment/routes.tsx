import ProtectedRoute from "../../routes/ProtectedRoute";
import AdminLayout from "../../layouts/AdminLayout";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentManager from "./admin/EnrollmentManager";
import EnrollmentLearn from "./student/EnrollmentLearn";
import EnrollmentInstructor from "./teacher/EnrollmentInstructor";
// import { QuizAssignmentStudent } from "./student/QuizAssignmentStudent";
import { QuizAssignmentInstructor } from "./teacher/QuizAssignmentInstructor";
import { QuizAssignmentAdmin } from "./admin/QuizAssignmentAdmin";

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
  {
    path: "/admin/enrollments",
    element: (
      // <ProtectedRoute roles={["ADMIN"]}>
        <AdminLayout>
          <EnrollmentManager />
        </AdminLayout>
      //  </ProtectedRoute>
    ),
  },
  {
    path: "/admin/quiz-assignments",
    element: (
      // <ProtectedRoute roles={["ADMIN"]}>
        <AdminLayout>
          <QuizAssignmentAdmin />
        </AdminLayout>
      //  </ProtectedRoute>
    ),
  },
]