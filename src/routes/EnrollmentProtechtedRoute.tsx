import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 1. Thay Navigate bằng useNavigate
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { checkEnrollment, getCourseDetailBySlug } from "../features/course/api";

// Ví dụ dùng react-toastify (nếu bạn dùng thư viện khác thì thay thế hàm này)
import { toast } from "react-toastify"; 

interface EnrollmentProtectedRouteProps {
  children: React.ReactNode;
}

const EnrollmentProtectedRoute: React.FC<EnrollmentProtectedRouteProps> = ({ children }) => {
  const { slug } = useParams<{ slug: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Khởi tạo hook navigate
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEnrollment = async () => {
      // Case 1: Chưa đăng nhập hoặc thiếu slug
      if (!token || !slug) {
        setLoading(false);
        // Redirect đến login hoặc trang course tùy logic của bạn
        if (!token) navigate("/login", { replace: true }); 
        return;
      }

      try {
        // Bước 1: Lấy chi tiết khóa học từ slug để có được courseId
        const courseDetail = await getCourseDetailBySlug(slug);
        const courseId = courseDetail.courseId;
        // Bước 2: Dùng courseId (UUID) để kiểm tra enrollment
        const enrolled = await checkEnrollment(courseId);
        
        if (enrolled) {
          setIsEnrolled(true);
        } else {
          // Case 2: Chưa mua khóa học -> Hiện thông báo & Redirect
          
          // Cách 1: Dùng thư viện Toast (Khuyên dùng)
          toast.error("Bạn chưa mua khóa học này, vui lòng đăng ký để truy cập!");
          
          navigate(`/course/${slug}`, { replace: true });
        }
      } catch (error) {
        console.error("Lỗi kiểm tra enrollment:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        navigate(`/course/${slug}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyEnrollment();
  }, [slug, token, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang kiểm tra quyền truy cập...</div>;
  }

  // Nếu đã enrolled thì hiện nội dung, ngược lại null (vì navigate đã xử lý redirect ở trên)
  return isEnrolled ? <>{children}</> : null;
};

export default EnrollmentProtectedRoute;