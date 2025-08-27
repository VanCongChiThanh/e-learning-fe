import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { RootState, AppDispatch } from "./app/store";
import React, { ReactElement } from "react";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

// --- Route bảo vệ ---
function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactElement;
  roles?: string[];
}) {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  // Nếu có roles và user không thuộc role hợp lệ -> về Home
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// --- Route public (login, register,...) ---
function PublicRoute({ children }: { children: ReactElement }) {
  const { token } = useSelector((state: RootState) => state.auth);
  if (token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      // Khi app mount hoặc khi token thay đổi -> fetch user hiện tại
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout chung */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Chỉ login mới vào được */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Chỉ ADMIN mới vào được */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Route public không có layout */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
