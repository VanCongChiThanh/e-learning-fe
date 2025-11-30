import React, { useState } from "react";
import axiosAuth from "../../../api/axiosAuth";

interface DeleteSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: {
    sectionId: string;
    title: string;
    position: number;
  } | null;
  totalSections: number;
  onSuccess: () => void;
}

const DeleteSectionModal: React.FC<DeleteSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  totalSections,
  onSuccess,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!section) return;

    setDeleting(true);
    setError("");

    try {
      // Xóa section
      await axiosAuth.delete(`/courses/sections/${section.sectionId}`);

      // Nếu không phải section cuối cùng, cần cập nhật lại position
      // của các section phía sau
      const isLastSection = section.position === totalSections - 1;
      
      if (!isLastSection) {
        // Gọi callback để parent component xử lý việc cập nhật position
        // Parent sẽ fetch lại danh sách sections và cập nhật position
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error deleting section:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi xóa section");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      setError("");
      onClose();
    }
  };

  if (!isOpen || !section) return null;

  const isLastSection = section.position === totalSections - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold">Xác nhận xóa Section</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa section này không?
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#106c54] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {section.position + 1}
                </div>
                <span className="font-semibold text-gray-900">{section.title}</span>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                Vị trí: {section.position + 1} / {totalSections}
              </p>
            </div>

            {!isLastSection && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <p>
                      Đây không phải section cuối cùng. Sau khi xóa, vị trí của các section 
                      phía sau sẽ được tự động điều chỉnh.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <i className="fas fa-exclamation-triangle text-red-500 mt-0.5"></i>
                <div className="text-sm text-red-700">
                  <p className="font-semibold mb-1">Cảnh báo:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hành động này không thể hoàn tác</li>
                    <li>Tất cả bài giảng trong section này sẽ bị xóa</li>
                    <li>Dữ liệu sẽ bị mất vĩnh viễn</li>
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
              disabled={deleting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang xóa...
                </>
              ) : (
                <>
                  <i className="fas fa-trash"></i>
                  Xóa Section
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSectionModal;
