import axiosAuth from "../../../api/axiosAuth";
import {
  NotificationListResponse,
  NotificationResponse,
} from "../types/notificationTypes";

export const notificationAPI = {
  // Lấy danh sách thông báo
  getNotifications: async (params: {
    only_unread?: boolean;
    page?: number;
    paging?: number;
    sort?: string;
    order?: string;
  }): Promise<NotificationListResponse> => {
    const response = await axiosAuth.get("/notifications/all", { params });
    return response.data;
  },

  // Đánh dấu đã đọc một thông báo
  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await axiosAuth.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data.data;
  },

  // Đánh dấu đã đọc tất cả thông báo
  markAllAsRead: async (): Promise<void> => {
    await axiosAuth.put("/notifications/read-all");
  },

  // Xóa thông báo
  deleteNotification: async (notificationId: string): Promise<void> => {
    await axiosAuth.delete(`/notifications/${notificationId}`);
  },

  // Đếm số thông báo chưa đọc
  getUnreadCount: async (): Promise<number> => {
    const response = await axiosAuth.get("/notifications/unread-count");
    return response.data.data;
  },
};
