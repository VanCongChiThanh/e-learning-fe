import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPresignedUrlCourse,
  uploadCourseImageToS3,
  updateCourseImageUrl,
} from "../api";
import axiosAuth from "../../../api/axiosAuth";
import { useNavigate } from "react-router-dom";

const EditCourse: React.FC = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await axiosAuth.get(`/courses/${courseId}`);
        const data = res.data.data;
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
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

      // Nếu có file mới thì upload trước
      if (newImageFile) {
        const ext = "." + newImageFile.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrlCourse(ext);
        console.log("Presign:", url, key);
        await uploadCourseImageToS3(url, newImageFile);
        console.log("Upload S3 xong");
        const imageUrlFull = `https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
        await updateCourseImageUrl(courseId, imageUrlFull);
        imageToSave = `https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
        setImageUrl(imageToSave);
        //setPreviewImage(imageToSave);
        setNewImageFile(null);
      }

      /*await axiosAuth.put(`/courses/${courseId}`, {
        title,
        description,
        // Không cần gửi image ở đây, đã cập nhật riêng
      });*/

      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!course) return <div>Không tìm thấy khóa học.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          title="Edit"
        >
          <i className="fas fa-pen text-blue-600 text-lg"></i>
        </button>
        
        
      )}

      <h2 className="text-xl font-bold mb-4 text-center">Chỉnh sửa khóa học</h2>
      <form onSubmit={handleSave}>
        {/* Ảnh khóa học */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              previewImage ||
              imageUrl ||
              "https://ui-avatars.com/api/?name=Course"
            }
            alt="Course"
            className="w-32 h-32 rounded object-cover mb-4"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          )}
        </div>

        {/* Tiêu đề */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              isEditing
                ? "focus:ring-blue-500/50"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            required
          />
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              isEditing
                ? "focus:ring-blue-500/50"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            rows={4}
            required
          />
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
                setNewImageFile(null);
                if (course) {
                  setTitle(course.title);
                  setDescription(course.description);
                  setImageUrl(course.image ? `${course.image}` : null);
                }
              }}
              className="flex-1 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Hủy
            </button>
          </div>
        )}
      </form>
      <button
        className="w-full mt-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
        onClick={() => navigate(`/instructor/courses/${courseId}/detail`)}
      >
        Chỉnh sửa chi tiết khóa học
      </button>
    </div>
  );
};

export default EditCourse;