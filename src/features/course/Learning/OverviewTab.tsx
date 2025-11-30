import React, { useEffect, useState } from "react";
import axiosAuth from "../../../api/axiosAuth";

interface Tag {
  name: string;
  tagId: string;
}

interface CourseDetail {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: string;
  level: string;
  instructorId: string;
  category: string;
  image: string;
  tags: Tag[];
  averageRating: number;
  totalReviews: number;
  totalLectures: number;
  totalStudents: number;
  createdAt: number;
}

const instructorImage =
  "https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/50c87f7b-5bc2-4abe-afe8-47a175334670-2025-09-20T10%3A15%3A52.946%2B07%3A00..jpg";

const OverviewTab: React.FC<{ slug: string }> = ({ slug }) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      const res = await axiosAuth.get(`/courses/slug/${slug}/detail`);
      setCourse(res.data.data);
    }
    fetchCourse();
  }, [slug]);

  if (!course) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Tiêu đề khóa học */}
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <div className="flex items-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 font-bold text-lg">{course.averageRating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-600 text-sm">{course.totalReviews} đánh giá</span>
        </div>
        <div className="text-gray-600 text-sm">
          <span className="font-bold">{course.totalStudents}</span> học viên
        </div>
        <div className="text-gray-600 text-sm">
          <span className="font-bold">{course.totalLectures}</span> bài giảng
        </div>
        <div className="text-gray-600 text-sm">
          Trình độ: <span className="font-bold">{course.level}</span>
        </div>
      </div>

      {/* Giảng viên */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={instructorImage}
          alt="Giảng viên"
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold">Đình Lộc</div>
          <div className="text-gray-500 text-sm">Giảng viên BE</div>
          <div className="flex gap-2 mt-2">
            <button className="bg-gray-200 rounded p-2">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="bg-gray-200 rounded p-2">
              <i className="fab fa-youtube"></i>
            </button>
            <button className="bg-gray-200 rounded p-2">
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Thẻ */}
      <div className="mb-4 flex gap-2">
        {course.tags?.map(tag => (
          <span key={tag.tagId} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
            {tag.name}
          </span>
        ))}
      </div>

      {/* Mô tả */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Mô tả khóa học</h2>
        <p className="text-gray-700">{course.description}</p>
      </div>

      {/* Thông số khác */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-1">Thông tin chi tiết</h3>
          <div className="text-sm text-gray-700">
            <div>Trình độ: {course.level}</div>
            <div>Học viên: {course.totalStudents}</div>
            <div>Bài giảng: {course.totalLectures}</div>
            <div>Danh mục: {course.category}</div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Tính năng</h3>
          <div className="text-sm text-gray-700">
            <div>Có sẵn trên <span className="text-[#106c54] font-bold">iOS</span> và <span className="text-[#106c54] font-bold">Android</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
