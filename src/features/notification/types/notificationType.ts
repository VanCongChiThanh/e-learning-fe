export enum NotificationType {
  SYSTEM = "SYSTEM",
  COURSE = "COURSE",
  ENROLLMENT = "ENROLLMENT",
  ASSIGNMENT = "ASSIGNMENT",
  QUIZ = "QUIZ",
  ANNOUNCEMENT = "ANNOUNCEMENT",
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
  updated_at?: string;
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
