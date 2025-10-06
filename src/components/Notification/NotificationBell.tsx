import React, { useState, useEffect } from "react";
import { notificationAPI } from "../../features/notification/api/notificationAPI";
import Notification from "./Notification";
import "./NotificationBell.scss";
import { notificationSocket } from "../../features/notification/socket/notificationSocket"; // ví dụ websocket đã khởi tạo sẵn

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Lấy số lượng thông báo chưa đọc lần đầu
  const fetchUnreadCount = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const userId = localStorage.getItem("userId"); // hoặc lấy từ context/token
    if (userId) {
      notificationSocket.connect(userId, (notif) => {
        // Khi có thông báo mới -> tự tăng badge
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      notificationSocket.disconnect();
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mở panel -> có thể load lại danh sách thông báo
      fetchUnreadCount();
    }
  };

  return (
    <>
      <div className="notification-bell" onClick={handleToggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <Notification isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NotificationBell;
