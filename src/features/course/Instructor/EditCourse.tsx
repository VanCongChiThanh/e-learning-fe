import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPresignedUrlCourse,
  uploadCourseImageToS3,
  updateCourseImageUrl,
} from "../api";
import axiosAuth from "../../../api/axiosAuth";

const EditCourse: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await axiosAuth.get(`/courses/instructor/${courseId}/detail`);
        const data = res.data.data;
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price?.toString() || "");
        setLevel(data.level || "");
        setCategory(data.category || "");
        setImageUrl(data.image ? `${data.image}` : null);
      } catch (err) {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    try {
      let imageToSave = imageUrl;

      if (newImageFile) {
        const ext = "." + newImageFile.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrlCourse(ext);
        await uploadCourseImageToS3(url, newImageFile);
        const imageUrlFull = `https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
        await updateCourseImageUrl(courseId, imageUrlFull);
        imageToSave = imageUrlFull;
        setImageUrl(imageToSave);
        setNewImageFile(null);
        setPreviewImage(null);
      }

      // Cập nhật thông tin khóa học
      await axiosAuth.put(`/courses/${courseId}`, {
        title,
        description,
        price: parseFloat(price) || 0,
        level,
        category,
      });

      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setNewImageFile(null);
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setPrice(course.price?.toString() || "");
      setLevel(course.level || "");
      setCategory(course.category || "");
      setImageUrl(course.image ? `${course.image}` : null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-exclamation-triangle text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-600">Không tìm thấy khóa học</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chỉnh sửa khóa học</h1>
              <p className="text-green-100">Cập nhật thông tin và nội dung khóa học của bạn</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/instructor/courses/${courseId}/detail`)}
                className="bg-white text-[#106c54] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-cog"></i>
                Quản lý nội dung
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#106c54] transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Ảnh khóa học</h3>
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={
                      previewImage ||
                      imageUrl ||
                      "https://ui-avatars.com/api/?name=Course&background=6366f1&color=fff"
                    }
                    alt="Course"
                    className="w-full h-48 rounded-lg object-cover shadow-md"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer text-white text-center">
                        <i className="fas fa-camera text-2xl mb-2 block"></i>
                        <span className="text-sm">Thay đổi ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Nhấn vào ảnh để thay đổi. Kích thước khuyến nghị: 1280x720px
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Info Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-[#106c54]"></i>
                  Thông tin cơ bản
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề khóa học *
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="Nhập tiêu đề khóa học..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả khóa học *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      rows={4}
                      placeholder="Mô tả chi tiết về khóa học..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Course Details Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-[#106c54]"></i>
                  Chi tiết khóa học
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá khóa học (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <option value="">Chọn cấp độ</option>
                      <option value="BEGINNER">Cơ bản</option>
                      <option value="INTERMEDIATE">Trung cấp</option>
                      <option value="ADVANCED">Nâng cao</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="DEVELOPMENT">Lập trình</option>
                      <option value="BUSINESS">Kinh doanh</option>
                      <option value="DESIGN">Thiết kế</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="IT_SOFTWARE">CNTT & Phần mềm</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-times"></i>
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors flex items-center gap-2 disabled:bg-gray-400"
                    >
                      <i className="fas fa-save"></i>
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-[#106c54]"></i>
                Thao tác nhanh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/instructor/courses/${courseId}/detail`)}
                  className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <i className="fas fa-list text-[#106c54]"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Quản lý nội dung</div>
                      <div className="text-sm text-gray-500">Section và bài giảng</div>
                    </div>
                  </div>
                </button>
                
                <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <i className="fas fa-chart-line text-[#106c54]"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Thống kê</div>
                      <div className="text-sm text-gray-500">Xem báo cáo chi tiết</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;