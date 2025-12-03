import ProtectedRoute from "../../routes/ProtectedRoute";
import LearnerProfileEdit from "./learner/Edit";
import InstructorProfileEdit from "./instructor/Edit";
import InstructorProfilePage from "./instructor/InstructorProfilePage";
import LearnerChangePasswordPage from "./learner/ChangePasswordPage";
import InstructorChangePasswordPage from "./instructor/ChangePasswordPage";
import BankAccountPage from "./instructor/BankAccountPage";
import BankAccountConfirmPage from "./instructor/BankAccountConfirmPage";
import MyRevenuePage from "./instructor/MyRevenuePage";

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
    path: "/account-profile/change-password",
    element: (
      <ProtectedRoute roles={["LEARNER", "ADMIN"]} redirect="/login">
        <LearnerChangePasswordPage />
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
    path: "/instructor-profile/bank-account",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]} redirect="/login">
        <BankAccountPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor-profile/revenue",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]} redirect="/login">
        <MyRevenuePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/bank/account/confirm",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]} redirect="/login">
        <BankAccountConfirmPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor-profile/change-password",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]} redirect="/login">
        <InstructorChangePasswordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor/:id",
    element: <InstructorProfilePage />,
  },
];
