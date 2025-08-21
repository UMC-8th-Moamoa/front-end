// 더미 알림 데이터 & 헬퍼들

export type NotificationItem = {
  id: string;
  message: string;
  createdAt: string; // ISO
  read: boolean;
};

export type Pagination = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

// ---- 내부 더미 DB -------------------------------------------------
const today = new Date();
const daysAgo = (n: number) =>
  new Date(today.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

let DB: NotificationItem[] = [
  {
    id: "n-005",
    message: "모아모아 가입을 환영합니다! 🎉",
    createdAt: daysAgo(0),
    read: false,
  },
  // 필요한 만큼 더 추가 가능
];

// 최신순 정렬
const byCreatedDesc = (a: NotificationItem, b: NotificationItem) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// ---- 공개 API(더미) -----------------------------------------------

/** 더미: 페이지/사이즈로 잘라서 반환 */
export async function fetchNotifications(
  page = 1,
  size = 10
): Promise<{ items: NotificationItem[]; pagination: Pagination }> {
  const list = [...DB].sort(byCreatedDesc);
  const totalElements = list.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = (page - 1) * size;
  const end = start + size;
  const items = list.slice(start, end);
  return Promise.resolve({
    items,
    pagination: { page, size, totalPages, totalElements },
  });
}

/** 더미: 읽지 않은 게 하나라도 있는지 */
export async function getUnreadStatus(): Promise<boolean> {
  return Promise.resolve(DB.some((n) => !n.read));
}

/** 더미: 모두 읽음 처리 */
export async function markAllNotificationsRead(): Promise<void> {
  DB = DB.map((n) => ({ ...n, read: true }));
  return Promise.resolve();
}

/** (선택) 더미 데이터 초기화용 */
export function _resetDummy(list: NotificationItem[]) {
  DB = [...list];
}
