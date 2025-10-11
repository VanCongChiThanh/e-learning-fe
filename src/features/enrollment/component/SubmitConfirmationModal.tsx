import React from 'react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  timeRemaining: number;
}

const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  timeRemaining
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận nộp bài</h3>
          <p className="text-gray-600">Bạn có chắc chắn muốn nộp bài quiz không?</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{answeredCount}</div>
              <div className="text-gray-600">Đã trả lời</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${unansweredCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {unansweredCount}
              </div>
              <div className="text-gray-600">Chưa trả lời</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-center">
            <div className="text-sm text-gray-600">Thời gian còn lại</div>
            <div className="text-lg font-bold text-blue-600">{formatTime(timeRemaining)}</div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              <div className="text-sm text-amber-800">
                <p className="font-medium">Lưu ý:</p>
                <p>Bạn còn {unansweredCount} câu chưa trả lời. Những câu này sẽ được tính là sai.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Tiếp tục làm bài
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Nộp bài ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;