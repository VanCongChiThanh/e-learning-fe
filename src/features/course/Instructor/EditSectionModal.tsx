import React, { useState, useEffect } from "react";
import axiosAuth from "../../../api/axiosAuth";

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: {
    sectionId: string;
    title: string;
    description: string;
  } | null;
  onSuccess: () => void;
}

const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setDescription(section.description);
      setError("");
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    if (!section) return;

    setSaving(true);
    setError("");

    try {
      await axiosAuth.put(`/courses/sections/${section.sectionId}`, {
        title: title.trim(),
        description: description.trim(),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error updating section:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật section");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setError("");
      onClose();
    }
  };

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-edit text-2xl"></i>
              <h2 className="text-2xl font-bold">Chỉnh sửa Section</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tiêu đề Section <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent transition-all disabled:bg-gray-100"
                placeholder="VD: Giới thiệu về khóa học"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Mô tả Section
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent transition-all disabled:bg-gray-100"
                placeholder="Mô tả nội dung của section này..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vị trí (position) của section không thể thay đổi</li>
                    <li>Chỉ có thể cập nhật tiêu đề và mô tả</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
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
              disabled={saving || !title.trim()}
              className="px-6 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSectionModal;
