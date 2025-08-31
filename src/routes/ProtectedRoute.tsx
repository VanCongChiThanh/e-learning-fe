import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";

interface ProtectedRouteProps {
  children: ReactElement;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  // Nếu có roles và user không thuộc role hợp lệ -> về Home
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
