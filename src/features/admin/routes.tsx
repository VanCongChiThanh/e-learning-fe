import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "../../routes/ProtectedRoute";
import LoginAdmin from "./pages/LoginAdmin";
import InstructorApproval from "./pages/InstructorApproval";
import CoursesPage from "./pages/CoursesPage";
import UsersPage from "./pages/UsersPage";
import InstructorsPage from "./pages/InstructorsPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: <LoginAdmin />,
  },
  {
    path: "/admin/instructor-approval",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <InstructorApproval />
      </ProtectedRoute>
    ),
  },
  {
    path:"/admin/courses",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <CoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/instructors",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <InstructorsPage />
      </ProtectedRoute>
    ),
  },
];
