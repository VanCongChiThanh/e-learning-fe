import React, { useState, useEffect, useCallback } from "react";
import { notificationAPI } from "../../features/notification/api/notificationAPI";
import {
  NotificationResponse,
} from "../../features/notification/types/notificationTypes";
import "./Notification.scss";
import {
  getNotificationIcon, formatTime
} from "../../features/notification/utils/notificationUtils";
interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 6;

  // Lấy danh sách thông báo
  const fetchNotifications = async (
    page: number,
    onlyUnread?: boolean,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params: any = {
        page,
        paging: pageSize,
        sort: "created_at",
        order: "desc",
      };

      if (onlyUnread) {
        params.only_unread = true;
      }

      const response = await notificationAPI.getNotifications(params);

      const { data, meta } = response; // 👈 bóc tách đúng

      if (append) {
        setNotifications((prev) => [...prev, ...data]);
      } else {
        setNotifications(data);
      }

      setCurrentPage(meta.current_page);
      setHasMore(meta.current_page < meta.total_pages);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Xử lý thay đổi filter
  const handleFilterChange = useCallback((newFilter: "all" | "unread") => {
    setFilter(newFilter);
    setCurrentPage(1);
    const onlyUnread = newFilter === "unread";
    fetchNotifications(1, onlyUnread, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load thêm thông báo
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchNotifications(nextPage, filter === "unread", true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUnreadCount();
      handleFilterChange("all");
    }
  }, [isOpen, handleFilterChange]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-menu")) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  // Đánh dấu đã đọc
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setOpenMenuId(null);

      // Cập nhật local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );

      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();

      // Cập nhật local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Xóa thông báo
  const handleDelete = async (notificationId: string) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setOpenMenuId(null);

      // Xóa khỏi local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      fetchUnreadCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };




  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Thông báo</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="notification-controls">
          <div className="notification-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => handleFilterChange("all")}
            >
              Tất cả
            </button>
            <button
              className={filter === "unread" ? "active" : ""}
              onClick={() => handleFilterChange("unread")}
            >
              Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        <div className="notification-list">
          {loading ? (
            <div className="notification-loading">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">Không có thông báo</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.is_read ? "read" : "unread"
                }`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.created_at)}
                  </span>
                </div>

                {/* Chấm xanh cho chưa đọc */}
                {!notification.is_read && <div className="unread-dot"></div>}

                {/* Menu 3 chấm */}
                <div className="notification-menu">
                  <button
                    className="menu-trigger"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === notification.id ? null : notification.id
                      )
                    }
                  >
                    ⋮
                  </button>
                  {openMenuId === notification.id && (
                    <div className="menu-dropdown">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="delete-option"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {hasMore && (
          <div className="notification-load-more mx-auto my-2 text-green-700">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "\u0110ang t\u1ea3i..." : "Xem thông báo trước đó"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
