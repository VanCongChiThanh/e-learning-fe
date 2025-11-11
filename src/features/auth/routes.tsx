import LoginPage from "./pages/LoginPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import PublicRoute from "../../routes/PublicRoute";
import RegisterPage from "./pages/RegisterPage";
import Oauth2Callback from "./pages/Oauth2CallBack";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export const authRoutes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register/confirm",
    element: (
      <PublicRoute>
        <ConfirmationPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/password/reset",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/oauth2/callback/:provider",
    element: (
      <PublicRoute>
        <Oauth2Callback />
      </PublicRoute>
    ),
  },
];
