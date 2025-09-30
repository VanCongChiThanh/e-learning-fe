import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import LearnerProfileEdit from "./learner/Edit";
export const profileRoutes = [
  {
    path: "/account-profile",
    element: (
      <ProtectedRoute roles={["LEARNER", "ADMIN"]} redirect="/login">
        <MainLayout>
          <LearnerProfileEdit />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];
