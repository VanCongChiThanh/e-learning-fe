// notificationConfig.ts
import { NotificationType } from "../types/notificationTypes";
export interface NotificationConfigItem {
  icon: string;
  buildUrl: (metadata?: Record<string, any>) => string;
  label?: string;
}
export const notificationConfig: Record<
  NotificationType,
  NotificationConfigItem
> = {
  COURSE_ENROLLMENT: {
    icon: "✅",
    label: "Khóa học mới",
    buildUrl: (metadata) => `/courses/${metadata?.courseId || ""}`,
  },
  ASSIGNMENT_GRADED: {
    icon: "📝",
    label: "Bài tập chấm xong",
    buildUrl: (metadata) => `/assignments/${metadata?.assignmentId || ""}`,
  },
  NEW_COURSE_AVAILABLE: {
    icon: "📚",
    label: "Khóa học mới sẵn sàng",
    buildUrl: (metadata) => `/courses/${metadata?.courseId || ""}`,
  },
  COURSE_COMPLETED: {
    icon: "🏆",
    label: "Hoàn thành khóa học",
    buildUrl: (metadata) => `/courses/${metadata?.courseId || ""}/completed`,
  },
  PASSWORD_RESET: {
    icon: "🔑",
    label: "Đặt lại mật khẩu",
    buildUrl: () => `/account/reset-password`,
  },
  ACCOUNT_ACTIVATION: {
    icon: "✅",
    label: "Kích hoạt tài khoản",
    buildUrl: () => `/account/activate`,
  },
  SYSTEM_ALERT: {
    icon: "⚠️",
    label: "Cảnh báo hệ thống",
    buildUrl: () => `/system/alerts`,
  },
  INSTRUCTOR_MESSAGE: {
    icon: "✉️",
    label: "Tin nhắn từ giảng viên",
    buildUrl: (metadata) => `/messages/${metadata?.messageId || ""}`,
  },
};

