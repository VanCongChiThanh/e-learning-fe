import React, { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lectureId: UUID;
    title: string;
    description?: string;
    maxAttempts: number;
    passingScore: number;
    timeLimitMinutes: number;
    numberQuestions: number;
  }) => void;
  initialData?: {
    lectureId: UUID;
    title: string;
    description?: string;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    numberQuestions?: number;
  };
  lectureId?: UUID;
  title?: string;
}

export const QuizFormModal: React.FC<QuizFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  lectureId,
  title = 'Tạo Quiz Mới',
}) => {
  const [formData, setFormData] = useState({
    lectureId: lectureId || ('' as UUID),
    title: initialData?.title || '',
    description: initialData?.description || '',
    maxAttempts: initialData?.maxAttempts || 3,
    passingScore: initialData?.passingScore || 70,
    timeLimitMinutes: initialData?.timeLimitMinutes || 30,
    numberQuestions: initialData?.numberQuestions || 10,
  });
  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen) {
      setFormData({
        lectureId: lectureId || ('' as UUID),
        title: initialData?.title || '',
        description: initialData?.description || '',
        maxAttempts: initialData?.maxAttempts || 3,
        passingScore: initialData?.passingScore || 70,
        timeLimitMinutes: initialData?.timeLimitMinutes || 30,
        numberQuestions: initialData?.numberQuestions || 10,
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !lectureId) return;
    console.log(formData)
    onSubmit({
      lectureId: lectureId,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      maxAttempts: formData.maxAttempts,
      passingScore: formData.passingScore,
      timeLimitMinutes: formData.timeLimitMinutes,
      numberQuestions: formData.numberQuestions,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề Quiz *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                placeholder="Nhập tiêu đề quiz..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent resize-none"
                rows={3}
                placeholder="Nhập mô tả quiz..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Số lần làm tối đa
    </label>
    <input
      type="number"
      min="1"
      max="10"
      value={formData.maxAttempts}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          maxAttempts: parseInt(e.target.value) || 3,
        }))
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Điểm qua (%)* 
    </label>
    <input
      type="number"
      min="0"
      max="100"
      value={formData.passingScore}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          passingScore: parseInt(e.target.value) || 70,
        }))
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Thời gian (phút)
    </label>
    <input
      type="number"
      min="1"
      max="180"
      value={formData.timeLimitMinutes}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          timeLimitMinutes: parseInt(e.target.value) || 30,
        }))
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
    />
  </div>

  {/* 👇 Ô mới thêm cho số lượng câu hỏi */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Số lượng câu hỏi
    </label>
    <input
      type="number"
      min="1"
      max="100"
      value={formData.numberQuestions}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          numberQuestions: parseInt(e.target.value) || 10,
        }))
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
      placeholder="Nhập số lượng câu hỏi..."
    />
  </div>
</div>

          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
            >
              {initialData ? 'Cập nhật' : 'Tạo Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    courseId: UUID;
    title: string;
    description?: string;
    dueDate?: string;
  }) => void;
  initialData?: {
    courseId: UUID;
    title: string;
    description?: string;
    dueDate?: string;
  };
  courseId?: UUID;
  title?: string;
}

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  courseId,
  title = 'Tạo Bài Tập Mới',
}) => {
  const [formData, setFormData] = useState({
    courseId: courseId || ('' as UUID),
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
  });

  // Cập nhật formData khi props thay đổi
  useEffect(() => {
    if (isOpen) {
      setFormData({
        courseId: courseId || ('' as UUID),
        title: initialData?.title || '',
        description: initialData?.description || '',
        dueDate: initialData?.dueDate || '',
      });
    }
  }, [isOpen, courseId, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !courseId) {
      toast.info('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    onSubmit({
      courseId: courseId, // Sử dụng courseId từ props thay vì formData
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate || undefined,
    });
    
    // Reset form
    setFormData({
      courseId: courseId || ('' as UUID),
      title: '',
      description: '',
      dueDate: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề Bài Tập *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                placeholder="Nhập tiêu đề bài tập..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent resize-none"
                rows={3}
                placeholder="Nhập mô tả bài tập..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hạn nộp
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
            >
              {initialData ? 'Cập nhật' : 'Tạo Bài Tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};