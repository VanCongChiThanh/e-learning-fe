import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import LearnerProfileEdit from "./learner/Edit";
export const profileRoutes = [
  {
    path: "/account-profile",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <LearnerProfileEdit />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];
