// 알림 API 서비스 (명세 반영)
// baseURL에 이미 "/api"가 있다면 여기서는 붙이지 않습니다.

import instance from "../../api/axiosInstance";

/** ====== 공통 타입 ====== */
export interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** 목록 조회 (서버 스키마 가정: notifications + pagination + hasUnreadNotifications) */
type ListResp = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: {
    notifications: NotificationItem[];
    pagination: Pagination;
    hasUnreadNotifications: boolean;
  };
};

export async function fetchNotifications(page = 1, size = 10): Promise<{
  items: NotificationItem[];
  pagination: Pagination;
  hasUnread: boolean;
}> {
  const { data } = await instance.get<ListResp>("/notifications", { params: { page, size } });

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

/** ====== 단건/전체 읽음 상태, 생성 ====== */

// GET /notifications/unread-status
type UnreadStatusResp = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: { hasUnreadNotifications: boolean };
};

export async function getUnreadStatus(): Promise<boolean> {
  const { data } = await instance.get<UnreadStatusResp>("/notifications/unread-status");
  return data.resultType === "SUCCESS" && !!data.success?.hasUnreadNotifications;
}

// PATCH /notifications/{notificationId}/read
type ReadResp = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: { message: string };
};

export async function markNotificationRead(notificationId: number): Promise<string> {
  const { data } = await instance.patch<ReadResp>(`/notifications/${notificationId}/read`);
  if (data.resultType !== "SUCCESS" || !data.success) throw new Error("읽음 처리 실패");
  return data.success.message;
}

// PATCH /notifications/read-all
type ReadAllResp = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: { message: string; updatedCount: number };
};

export async function markAllNotificationsRead(): Promise<{ message: string; updatedCount: number }> {
  const { data } = await instance.patch<ReadAllResp>("/notifications/read-all");
  if (data.resultType !== "SUCCESS" || !data.success) throw new Error("전체 읽음 처리 실패");
  return { message: data.success.message, updatedCount: data.success.updatedCount };
}

// POST /notifications
type CreateResp = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: {
    message: string;
    notification: { id: number; message: string; createdAt: string };
  };
};

export async function createNotification(payload: { userId: number; message: string }): Promise<{
  id: number;
  message: string;
  createdAt: string;
}> {
  const { data } = await instance.post<CreateResp>("/notifications", payload);
  if (data.resultType !== "SUCCESS" || !data.success) throw new Error("알림 생성 실패");
  const n = data.success.notification;
  return { id: n.id, message: n.message, createdAt: n.createdAt };
}
