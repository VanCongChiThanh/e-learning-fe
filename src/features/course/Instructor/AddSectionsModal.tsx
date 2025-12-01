import React, { useState } from "react";
import axiosAuth from "../../../api/axiosAuth";

interface SectionInput {
  id: string;
  title: string;
  description: string;
  position: number;
}

interface AddSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  currentSectionsCount: number;
  onSuccess: () => void;
}

const AddSectionsModal: React.FC<AddSectionsModalProps> = ({
  isOpen,
  onClose,
  courseId,
  currentSectionsCount,
  onSuccess,
}) => {
  const [sections, setSections] = useState<SectionInput[]>([
    { id: Date.now().toString(), title: "", description: "", position: currentSectionsCount + 1 },
  ]);
  const [saving, setSaving] = useState(false);

  const addSection = () => {
    const newSection: SectionInput = {
      id: Date.now().toString(),
      title: "",
      description: "",
      position: currentSectionsCount + sections.length + 1,
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    if (sections.length === 1) return;
    setSections(sections.filter((s) => s.id !== id));
    // Cập nhật lại position
    setSections((prev) =>
      prev.map((s, idx) => ({ ...s, position: currentSectionsCount + idx + 1 }))
    );
  };

  const updateSection = (id: string, field: keyof SectionInput, value: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Gọi API lần lượt cho từng section
      const promises = sections.map(async (section) => {
        const payload = {
          title: section.title,
          description: section.description,
          position: section.position,
        };
        return await axiosAuth.post(`/courses/${courseId}/sections`, payload);
      });

      await Promise.all(promises);
      alert(`Đã thêm thành công ${sections.length} chương!`);
      onSuccess();
      onClose();
      // Reset
      setSections([
        { id: Date.now().toString(), title: "", description: "", position: currentSectionsCount + 1 },
      ]);
    } catch (error: any) {
      console.error("Error creating sections:", error);
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo chương!";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Thêm chương mới</h2>
              <p className="text-green-100 text-sm">
                Tạo cấu trúc nội dung cho khóa học của bạn
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#106c54] text-white rounded-full flex items-center justify-center font-bold">
                      {section.position}
                    </div>
                    <h3 className="font-semibold text-gray-700">
                      Chương {section.position}
                    </h3>
                  </div>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Xóa chương này"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề chương <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54]"
                      placeholder={`VD: Giới thiệu về ${courseId ? 'khóa học' : 'chủ đề'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả chương (tùy chọn)
                    </label>
                    <textarea
                      value={section.description}
                      onChange={(e) =>
                        updateSection(section.id, "description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#106c54]"
                      rows={2}
                      placeholder="Mô tả ngắn gọn về nội dung chương này..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              onClick={addSection}
              className="w-full border-2 border-dashed border-[#106c54] text-[#106c54] rounded-lg p-4 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <i className="fas fa-plus-circle"></i>
              Thêm chương mới
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Mẹo tổ chức nội dung:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Mỗi chương nên tập trung vào một chủ đề cụ thể</li>
                    <li>• Sắp xếp chương theo trình tự logic từ cơ bản đến nâng cao</li>
                    <li>• Đặt tên chương rõ ràng, dễ hiểu</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <i className="fas fa-layer-group text-[#106c54] mr-2"></i>
                Tổng cộng: <span className="font-semibold">{sections.length} chương</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Lưu {sections.length} chương
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSectionsModal;
