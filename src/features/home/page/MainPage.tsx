import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import HomePage from "./HomePage/HomePage";
import LandingPage from "./LandingPage/LandingPage";

/**
 * Component wrapper để điều hướng:
 * - Nếu đã đăng nhập → HomePage
 * - Nếu chưa đăng nhập → LandingPage
 */
const LandingOrHomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Kiểm tra user đã đăng nhập chưa
  const isAuthenticated = !!user;

  return isAuthenticated ? <HomePage /> : <LandingPage />;
};

export default LandingOrHomePage;
