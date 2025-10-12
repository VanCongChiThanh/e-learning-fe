export enum NotificationType {
  COURSE_ENROLLMENT = "COURSE_ENROLLMENT",
  ASSIGNMENT_GRADED = "ASSIGNMENT_GRADED",
  NEW_COURSE_AVAILABLE = "NEW_COURSE_AVAILABLE",
  COURSE_COMPLETED = "COURSE_COMPLETED",
  PASSWORD_RESET  = "PASSWORD_RESET",
  ACCOUNT_ACTIVATION = "ACCOUNT_ACTIVATION",
  INSTRUCTOR_MESSAGE = "INSTRUCTOR_MESSAGE",
  SYSTEM_ALERT = "SYSTEM_ALERT",
}

export interface NotificationResponse {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: string | null;
  is_read: boolean;
  created_at?: string;
}

export interface PageInfo {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_count: number;
}

export interface NotificationListResponse {
  data: NotificationResponse[];
  meta: PageInfo;
}
