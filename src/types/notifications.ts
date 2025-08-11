import api from "../services/api";

export interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    notifications: NotificationItem[];
    pagination: {
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    hasUnreadNotifications: boolean;
  };
}

export const fetchNotifications = (page = 1, size = 10) =>
  api.get<NotificationResponse>("/notifications", { params: { page, size } });
