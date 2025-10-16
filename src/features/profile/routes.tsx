import ProtectedRoute from "../../routes/ProtectedRoute";
import LearnerProfileEdit from "./learner/Edit";
import InstructorProfileEdit from "./instructor/Edit";
import InstructorProfilePage from "./instructor/InstructorProfilePage"; 
export const profileRoutes = [
  {
    path: "/account-profile",
    element: (
      <ProtectedRoute roles={["LEARNER", "ADMIN"]} redirect="/login">
          <LearnerProfileEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor-profile",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]} redirect="/login">
          <InstructorProfileEdit />
      </ProtectedRoute>
    ),
  },
  {
    path:"/instructor/:id",
    element: (
          <InstructorProfilePage />
    ),
  }
];
