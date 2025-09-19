import AdminPage from "./AdminPage";
import ProtectedRoute from "../../routes/ProtectedRoute";
import AdminLayout from "../../layouts/AdminLayout";
import LoginAdmin from "./LoginAdmin";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["ADMIN"]}>
        <AdminLayout>
          <AdminPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: <LoginAdmin />,
  },
];
