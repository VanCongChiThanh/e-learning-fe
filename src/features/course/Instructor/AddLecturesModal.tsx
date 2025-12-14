import React, { useState } from "react";
import axiosAuth from "../../../api/axiosAuth";
import { getPresignedUrlVideoLecture, uploadVideoLectureToS3, updateVideoLecture } from "../api";

interface LectureInput {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  position: number;
  videoFile?: File;
  type: "VIDEO" | "QUIZ" | "CODING";
}

interface AddLecturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  sectionTitle: string;
  currentLecturesCount: number;
  onSuccess: () => void;
}

const AddLecturesModal: React.FC<AddLecturesModalProps> = ({
  isOpen,
  onClose,
  sectionId,
  sectionTitle,
  currentLecturesCount,
  onSuccess,
}) => {
  const [lectures, setLectures] = useState<LectureInput[]>([
    {
      id: Date.now().toString(),
      title: "",
      duration: 0,
      videoUrl: "",
      position: currentLecturesCount,
      type: "VIDEO",
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addLecture = () => {
    const newLecture: LectureInput = {
      id: Date.now().toString(),
      title: "",
      duration: 0,
      videoUrl: "",
      position: currentLecturesCount + lectures.length,
      type: "VIDEO",
    };
    setLectures([...lectures, newLecture]);
  };

  const removeLecture = (id: string) => {
    if (lectures.length === 1) return;
    const filtered = lectures.filter((lec) => lec.id !== id);
    // Cập nhật lại position
    const updated = filtered.map((lec, index) => ({
      ...lec,
      position: currentLecturesCount + index,
    }));
    setLectures(updated);
  };

  const updateLecture = (id: string, field: keyof LectureInput, value: any) => {
    setLectures((prev) =>
      prev.map((lec) => (lec.id === id ? { ...lec, [field]: value } : lec))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const emptyTitles = lectures.filter((lec) => !lec.title.trim());
    if (emptyTitles.length > 0) {
      setError("Tất cả các bài giảng phải có tiêu đề");
      return;
    }

    const invalidDurations = lectures.filter((lec) => lec.duration <= 0);
    if (invalidDurations.length > 0) {
      setError("Thời lượng phải lớn hơn 0 phút");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Xử lý upload video cho từng lecture nếu có file
      const processedLectures = await Promise.all(lectures.map(async (lecture) => {
        let finalVideoUrl = lecture.videoUrl;

        if (lecture.type === "VIDEO" && lecture.videoFile) {
          const ext = "." + lecture.videoFile.name.split(".").pop()?.toLowerCase();
          const { url, key } = await getPresignedUrlVideoLecture(ext);
          await uploadVideoLectureToS3(url, lecture.videoFile);
          finalVideoUrl = `https://dinhlooc-test-2025.s3.us-east-1.amazonaws.com/${encodeURIComponent(key)}`;
        }

        return { ...lecture, videoUrl: finalVideoUrl };
      }));

      // Tạo từng lecture một (API chỉ hỗ trợ tạo 1 lecture/request)
      const createPromises = processedLectures.map((lecture) =>
        axiosAuth.post(`/sections/${sectionId}/lectures`, {
          title: lecture.title.trim(),
          duration: lecture.duration,
          sourceUrl: lecture.videoUrl || null,
          position: lecture.position,
          type: lecture.type,
        })
      );

      await Promise.all(createPromises);

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setLectures([
        {
          id: Date.now().toString(),
          title: "",
          duration: 0,
          videoUrl: "",
          position: 0,
          type: "VIDEO",
        },
      ]);
    } catch (err: any) {
      console.error("Error creating lectures:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo bài giảng");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setLectures([
        {
          id: Date.now().toString(),
          title: "",
          duration: 0,
          videoUrl: "",
          position: currentLecturesCount,
          type: "VIDEO",
        },
      ]);
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <i className="fas fa-video text-2xl"></i>
                <h2 className="text-2xl font-bold">Thêm Bài giảng</h2>
              </div>
              <p className="text-white text-opacity-90">
                Section: <span className="font-semibold">{sectionTitle}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={saving}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Lectures List */}
            <div className="space-y-4">
              {lectures.map((lecture, index) => (
                <div
                  key={lecture.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#106c54] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Position Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#106c54] text-white rounded-full flex items-center justify-center font-bold">
                        {lecture.position + 1}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                          Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) => updateLecture(lecture.id, "title", e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent text-sm disabled:bg-gray-100"
                          placeholder="VD: Giới thiệu về React Hooks"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                          Loại bài giảng <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={lecture.type}
                          onChange={(e) => updateLecture(lecture.id, "type", e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent text-sm disabled:bg-gray-100"
                        >
                          <option value="VIDEO">Video</option>
                          <option value="QUIZ">Quiz</option>
                          <option value="CODING">Coding Exercise</option>
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                          Thời lượng (phút) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={lecture.duration || ""}
                          onChange={(e) => updateLecture(lecture.id, "duration", parseInt(e.target.value) || 0)}
                          disabled={saving}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent text-sm disabled:bg-gray-100"
                          placeholder="VD: 15"
                        />
                      </div>

                      {/* Video Upload */}
                      <div className="md:col-span-2">
                        <span className="block text-gray-700 font-semibold mb-2 text-sm">
                          Video bài giảng
                        </span>
                        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#106c54] transition-colors bg-gray-50 relative group cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                updateLecture(lecture.id, "videoFile", file);
                              }
                            }}
                            disabled={saving}
                            className="hidden"
                          />
                          {lecture.videoFile ? (
                            <div className="flex flex-col items-center">
                              <i className="fas fa-file-video text-4xl text-[#106c54] mb-2"></i>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {lecture.videoFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(lecture.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-[#106c54] mt-2 group-hover:underline">
                                Nhấn để thay đổi video
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                              <p className="text-sm text-gray-600">
                                Nhấn để tải lên video bài giảng
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                MP4, MKV, AVI (Max 500MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Remove Button */}
                    {lectures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLecture(lecture.id)}
                        disabled={saving}
                        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={addLecture}
              disabled={saving}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#106c54] hover:text-[#106c54] hover:bg-green-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Thêm bài giảng khác
            </button>

            {/* Info Box - Moved to bottom */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Hướng dẫn:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Thêm nhiều bài giảng cùng lúc để tiết kiệm thời gian</li>
                    <li>Vị trí (position) sẽ được tự động đánh số</li>
                    <li>Video là tùy chọn, có thể cập nhật sau</li>
                    <li>Thời lượng tính bằng phút</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                <i className="fas fa-list-ol text-[#106c54] mr-2"></i>
                Tổng số bài giảng: <span className="font-semibold text-[#106c54]">{lectures.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Vị trí bắt đầu: <span className="font-semibold">{currentLecturesCount + 1}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || lectures.length === 0}
                className="px-6 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang xử lý & tạo bài giảng...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Tạo {lectures.length} bài giảng
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLecturesModal;
