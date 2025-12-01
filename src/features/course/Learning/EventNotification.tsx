import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface EventNotificationProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  linkTo?: string;    // Tùy chọn: Dùng cho điều hướng (sự kiện Code)
  onClick?: () => void; // Tùy chọn: Dùng cho hành động tại chỗ (sự kiện Quiz)
}

const EventNotification: React.FC<EventNotificationProps> = ({ isVisible, title, message, onClose, linkTo, onClick }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Hàm này sẽ được gọi khi nhấn vào toàn bộ thông báo
  const handleWrapperClick = () => {
    if (onClick) {
      onClick(); // Thực thi hàm được truyền vào
    }
    onClose(); // Luôn đóng thông báo sau khi nhấn
  };

  const handleCloseButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Giao diện chung cho thông báo
  const NotificationContent = () => (
    <div className="bg-white rounded-lg shadow-2xl p-4 flex items-start w-full">
      <div className="flex-shrink-0 pt-0.5">
        {/* Thay đổi icon cho phù hợp với từng loại event */}
        <i className={`fa-solid ${linkTo ? 'fa-code text-[#106c54]' : 'fa-question-circle text-blue-600'} text-xl`}></i>
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{message}</p>
        <p className="mt-1 text-sm text-gray-700 truncate">{title}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button onClick={handleCloseButton} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
  );

  const wrapperClasses = `fixed bottom-5 right-5 w-full max-w-sm z-50 transition-all duration-500 ease-in-out cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`;

  return (
    <div className={wrapperClasses}>
      {linkTo ? (
        // Nếu có linkTo, bọc bằng thẻ Link
        <Link to={linkTo} onClick={onClose} className="no-underline">
          <NotificationContent />
        </Link>
      ) : (
        // Nếu không, bọc bằng div có sự kiện onClick
        <div onClick={handleWrapperClick} role="button">
          <NotificationContent />
        </div>
      )}
    </div>
  );
};

export default EventNotification;