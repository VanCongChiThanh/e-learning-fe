import LoginPage from "./pages/LoginPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import PublicRoute from "../../routes/PublicRoute";
import RegisterPage from "./pages/RegisterPage";

export const authRoutes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  // Nếu sau này có thêm register, forgot password,... thì thêm ở đây
  // {
  //   path: "/register",
  //   element: (
  //     <PublicRoute>
  //       <MainLayout>
  //         <RegisterPage />
  //       </MainLayout>
  //     </PublicRoute>
  //   ),
  // },
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
];
