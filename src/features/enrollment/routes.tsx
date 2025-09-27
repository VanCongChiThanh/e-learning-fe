import ProtectedRoute from "../../routes/ProtectedRoute";
import AdminLayout from "../../layouts/AdminLayout";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentManager from "./admin/EnrollmentManager";
import EnrollmentTeacher from "./teacher/EnrollmentTeacher";
import EnrollmentLearn from "./student/EnrollmentLearn";
import Progress from "./student/Progress";

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
    path: "/learn/enrollments/sessions",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <EnrollmentLearn />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learn/progress",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <Progress />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/enrollments",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EnrollmentTeacher courseId="a1c2d3e4-f567-8901-2345-6789abcdef13" />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/enrollments",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <AdminLayout>
          <EnrollmentManager />
        </AdminLayout>
       </ProtectedRoute>
    ),
  },
];