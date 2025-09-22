import React, { useEffect, useState } from "react";
import {
  getPresignedUrlVideoLecture,
  uploadVideoLectureToS3,
  updateVideoLecture,
} from "../api";
import axiosAuth from "../../../api/axiosAuth";
import { useParams } from "react-router-dom";

const EditLecture: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLecture() {
      setLoading(true);
      try {
        const res = await axiosAuth.get(`/sections/{sectionId}/lectures/${lectureId}`);
        const data = res.data.data;
        setLecture(data);
        setTitle(data.title);
        setVideoUrl(data.videoUrl || null);
      } catch {
        setLecture(null);
      } finally {
        setLoading(false);
      }
    }
    if (lectureId) fetchLecture();
  }, [lectureId]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewVideoFile(file);
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
      }

      

      alert("Cập nhật thành công!");
    } catch {
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!lecture) return <div>Không tìm thấy bài giảng.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Chỉnh sửa bài giảng</h2>
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Video bài giảng</label>
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-48 mb-2 rounded" />
          ) : (
            <div className="text-gray-500 mb-2">Chưa có video</div>
          )}
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default EditLecture;