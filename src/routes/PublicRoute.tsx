import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";

interface PublicRouteProps {
  children: ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  if (token) return <Navigate to="/" replace />;
  return children;
};

export default PublicRoute;
