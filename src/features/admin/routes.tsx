import AdminPage from "./AdminPage";
import ProtectedRoute from "../../routes/ProtectedRoute";
import AdminLayout from "../../layouts/AdminLayout";

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
];
