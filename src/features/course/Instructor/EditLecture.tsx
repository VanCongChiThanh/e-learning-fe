import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPresignedUrlVideoLecture,
  uploadVideoLectureToS3,
  updateVideoLecture,
} from "../api";
import axiosAuth from "../../../api/axiosAuth";

interface Course {
  courseId: string;
  title: string;
  image: string;
  level: string;
  category: string;
}

interface Section {
  sectionId: string;
  title: string;
  position: number;
}

interface Lecture {
  lectureId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  position: number;
}

const EditLecture: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchLectureData() {
  setLoading(true);
  try {
    const lectureRes = await axiosAuth.get(`/sections/{sectionId}/lectures/${lectureId}`);
    const lectureData = lectureRes.data.data;
    console.log("🎬 Lecture data:", lectureData);
    
    const sectionRes = await axiosAuth.get(`/courses/sections/${lectureData.sectionId}`);
    const sectionData = sectionRes.data.data;
    console.log("📦 Section data:", sectionData);

    const courseRes = await axiosAuth.get(`/courses/${sectionData.courseId}`);
    const courseData = courseRes.data.data;
    console.log("📚 Course data:", courseData);

    setLecture(lectureData);
    setSection(sectionData);
    setCourse(courseData);

    setTitle(lectureData.title);
    setDescription(lectureData.description || "");
    setDuration(lectureData.duration?.toString() || "");
    setVideoUrl(lectureData.videoUrl || null);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  } finally {
    setLoading(false);
  }
}
    if (lectureId) fetchLectureData();
  }, [lectureId]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureId) return;
    setSaving(true);
    try {
      let videoToSave = videoUrl;

      if (newVideoFile) {
        const ext = "." + newVideoFile.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrlVideoLecture(ext);
        await uploadVideoLectureToS3(url, newVideoFile);
        const videoUrlFull = `https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
        await updateVideoLecture(lectureId, videoUrlFull);
        videoToSave = videoUrlFull;
        setVideoUrl(videoToSave);
        setNewVideoFile(null);
        setVideoPreview(null);
      }

      // Update lecture info
      await axiosAuth.put(`/sections/lectures/${lectureId}`, {
        title,
        description,
        duration: parseInt(duration) || 0,
      });

      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setNewVideoFile(null);
    setVideoPreview(null);
    if (lecture) {
      setTitle(lecture.title);
      setDescription(lecture.description || "");
      setDuration(lecture.duration?.toString() || "");
      setVideoUrl(lecture.videoUrl || null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (!lecture || !section || !course) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-exclamation-triangle text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-600">Không tìm thấy bài giảng</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="bg-white rounded-lg shadow px-6 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => navigate('/instructor/courses')}
                className="hover:text-[#106c54] transition-colors"
              >
                Khóa học của tôi
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <button
                onClick={() => navigate(`/instructor/courses/${course.courseId}/edit`)}
                className="hover:text-[#106c54] transition-colors"
              >
                {course.title}
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <button
                onClick={() => navigate(`/instructor/courses/${course.courseId}/detail`)}
                className="hover:text-[#106c54] transition-colors"
              >
                Quản lý nội dung
              </button>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-gray-900 font-medium">{section.title}</span>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-[#106c54] font-medium">{lecture.title}</span>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img
                src={course.image}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover shadow-lg"
              />
              <div>
                <div className="text-sm text-green-200 mb-1">
                  {course.title} → {section.title}
                </div>
                <h1 className="text-3xl font-bold mb-2">Chỉnh sửa bài giảng</h1>
                <p className="text-green-100">{lecture.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/instructor/courses/${course.courseId}/detail`)}
                className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#106c54] transition-colors flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-[#106c54] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-play-circle text-[#106c54]"></i>
                Video bài giảng
              </h3>
              
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {videoPreview || videoUrl ? (
                  <video
                    src={videoPreview || videoUrl || ""}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <i className="fas fa-video text-6xl mb-4"></i>
                      <p>Chưa có video</p>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4 block"></i>
                    <p className="text-gray-600 mb-2">Nhấn để chọn video hoặc kéo thả file vào đây</p>
                    <p className="text-sm text-gray-500">Hỗ trợ: MP4, AVI, MOV (tối đa 500MB)</p>
                  </label>
                </div>
              )}
            </div>

            {/* Lecture Info Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-[#106c54]"></i>
                Thông tin bài giảng
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài giảng *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                      isEditing
                        ? "border-gray-300 bg-white"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                    }`}
                    placeholder="Nhập tiêu đề bài giảng..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả bài giảng
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
                    placeholder="Mô tả nội dung bài giảng..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54] transition-colors ${
                      isEditing
                        ? "border-gray-300 bg-white"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed"
                    }`}
                    placeholder="0"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
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
                      className="flex-1 px-6 py-3 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                      <i className="fas fa-save"></i>
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-graduation-cap text-[#106c54]"></i>
                Thông tin khóa học
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Khóa học:</span>
                  <p className="font-medium text-gray-900">{course.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Section:</span>
                  <p className="font-medium text-gray-900">{section.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Vị trí:</span>
                  <p className="font-medium text-gray-900">Bài {lecture.position}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm">
                  <i className="fas fa-eye text-[#106c54]"></i>
                  <span>Xem trước bài giảng</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm">
                  <i className="fas fa-copy text-[#106c54]"></i>
                  <span>Sao chép bài giảng</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 text-sm">
                  <i className="fas fa-trash"></i>
                  <span>Xóa bài giảng</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-chart-bar text-[#106c54]"></i>
                Thống kê nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-semibold text-[#106c54]">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-semibold text-green-600">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đánh giá:</span>
                  <span className="font-semibold text-yellow-600">0/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;