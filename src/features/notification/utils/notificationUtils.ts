import { notificationConfig } from "../config/notificationConfig";
import {
  NotificationResponse,
  NotificationType,
} from "../types/notificationTypes";

/**
 * Parse metadata string JSON -> object
 */
export const parseMetadata = (
  metadata: string | null
): Record<string, string> => {
  if (!metadata) return {};
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
};

/**
 * Lấy URL redirect dựa vào type + metadata
 */
export const getNotificationUrl = (notif: NotificationResponse) => {
  const config = notificationConfig[notif.type as NotificationType];
  if (config) {
    const metadata =
      typeof notif.metadata === "object" && notif.metadata !== null
        ? notif.metadata
        : {};
    const url = config.buildUrl(metadata);
    return url;
  }
};

export const getNotificationIcon = (type: NotificationType) => {
  return notificationConfig[type]?.icon || "🔔";
};
// Format thời gian
export const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};
