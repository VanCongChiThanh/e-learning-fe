import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirect?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles ,redirect}) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  console.log("User role:", user?.role); // Debugging line
  if (!token) return <Navigate to={redirect || "/login"} replace />;
  if (roles && user && !roles.includes(user.role))
    return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
