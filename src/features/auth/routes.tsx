import LoginPage from "./LoginPage";
import PublicRoute from "../../routes/PublicRoute";

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
];
