// src/services/notifications.ts
import api from "./api";

export interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NotificationResponse {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    notifications: NotificationItem[];
    pagination: Pagination;
    hasUnreadNotifications: boolean;
  };
}

/** 스키마 고정 파싱 */
export async function fetchNotifications(page = 1, size = 10): Promise<{
  items: NotificationItem[];
  pagination: Pagination;
  hasUnread: boolean;
}> {
  const { data } = await api.get<NotificationResponse>("/notifications", {
    params: { page, size },
  });

  if (data.resultType !== "SUCCESS" || !data.success) {
    return {
      items: [],
      pagination: { page, size, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: false },
      hasUnread: false,
    };
  }

  const { notifications, pagination, hasUnreadNotifications } = data.success;
  return {
    items: notifications ?? [],
    pagination,
    hasUnread: !!hasUnreadNotifications,
  };
}
