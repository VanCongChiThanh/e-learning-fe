import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/store/authSlice";
import { RootState, AppDispatch } from "./app/store";
import { appRoutes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, [token, dispatch]);

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
