import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  setInitialized,
} from "./features/auth/store/authSlice";
import { RootState, AppDispatch } from "./app/store";
import { appRoutes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isInitialized } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      // No token, mark as initialized
      dispatch(setInitialized());
    }
  }, [token, dispatch]);

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Các route khác từ features */}
        {appRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}

export default App;
