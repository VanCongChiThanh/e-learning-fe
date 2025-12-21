import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../../api/axiosAuth";
import {
  getPresignedUrlCourse,
  uploadCourseImageToS3,
  updateCourseImageUrl,
} from "../api";

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [courseStatus, setCourseStatus] = useState("DRAFT");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Tạo khóa học trước
      const courseData = {
        title,
        description,
        price: parseFloat(price) || 0,
        level,
        category,
        courseStatus,
        image: "https://ui-avatars.com/api/?name=Course&background=106c54&color=fff&size=400", // Default image
      };

      const createRes = await axiosAuth.post("/courses", courseData);
      const newCourse = createRes.data.data;
      console.log("✅ Course created:", newCourse);

      // Nếu có ảnh, upload ảnh lên S3 và cập nhật
      if (imageFile && newCourse.courseId) {
        try {
          const ext = "." + imageFile.name.split(".").pop()?.toLowerCase();
          const { url, key } = await getPresignedUrlCourse(ext);
          await uploadCourseImageToS3(url, imageFile);
          const imageUrlFull = `https://e-learning-data.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
          await updateCourseImageUrl(newCourse.courseId, imageUrlFull);
          console.log("✅ Image uploaded:", imageUrlFull);
        } catch (imgError) {
          console.error("⚠️ Image upload failed:", imgError);
          // Không throw error, vì khóa học đã tạo thành công
        }
      }

      alert("Tạo khóa học thành công!");
      navigate(`/instructor/courses/${newCourse.courseId}/detail`);
    } catch (error: any) {
      console.error("❌ Error creating course:", error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo khóa học!";
      alert(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tạo khóa học mới</h1>
              <p className="text-green-100">Chia sẻ kiến thức của bạn với hàng ngàn học viên</p>
            </div>
            <button
              onClick={() => navigate("/instructor/my-courses")}
              className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#106c54] transition-colors flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Quay lại
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-image text-[#106c54]"></i>
                  Ảnh bìa khóa học
                </h3>
                
                <div className="text-center">
                  <div className="relative inline-block w-full">
                    <img
                      src={imagePreview || "https://ui-avatars.com/api/?name=Course&background=106c54&color=fff&size=400"}
                      alt="Course preview"
                      className="w-full h-48 rounded-lg object-cover shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer text-white text-center">
                        <i className="fas fa-camera text-3xl mb-2 block"></i>
                        <span className="text-sm">Chọn ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Kích thước khuyến nghị: 1280x720px
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Định dạng: JPG, PNG (tối đa 5MB)
                  </p>
                </div>

                {/* Quick Tips */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-[#106c54] text-sm mb-2 flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i>
                    Mẹo tạo khóa học
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Tiêu đề ngắn gọn, hấp dẫn</li>
                    <li>✓ Mô tả rõ ràng nội dung</li>
                    <li>✓ Chọn level phù hợp</li>
                    <li>✓ Ảnh bìa chất lượng cao</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-[#106c54]"></i>
                  Thông tin cơ bản
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề khóa học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                      placeholder="VD: Lập trình Python từ cơ bản đến nâng cao"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả khóa học <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                      rows={5}
                      placeholder="Mô tả chi tiết về nội dung, mục tiêu và đối tượng của khóa học..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {description.length}/500 ký tự
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-[#106c54]"></i>
                  Chi tiết khóa học
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                      required
                    >
                      <option value="">Chọn cấp độ</option>
                      <option value="BEGINNER">Cơ bản</option>
                      <option value="INTERMEDIATE">Trung cấp</option>
                      <option value="ADVANCED">Nâng cao</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="DEVELOPMENT">Lập trình</option>
                      <option value="BUSINESS">Kinh doanh</option>
                      <option value="DESIGN">Thiết kế</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="IT_SOFTWARE">CNTT & Phần mềm</option>
                      <option value="AI_AND_MACHINE_LEARNING">AI & Machine Learning</option>
                      <option value="DATA_SCIENCE">Data Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá khóa học (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                      placeholder="0 (Miễn phí)"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Để trống hoặc 0 nếu khóa học miễn phí
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Công khai</option>
                      <option value="ARCHIVED">Lưu trữ</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Chọn "Bản nháp" để chỉnh sửa sau
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/instructor/my-courses")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-times"></i>
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-8 py-3 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle"></i>
                        Tạo khóa học
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
