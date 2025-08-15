// services/calendar/calendar.ts

import instance from "../../api/axiosInstance";

/** ---------- Types ---------- */
export type CalendarFriend = {
  id: number;
  name: string;
  photo?: string | null;
  hasActiveEvent: boolean;
};

export type CalendarMonthItem = {
  date: string;              // "YYYY-MM-DD"
  friends: CalendarFriend[]; // 그 날짜 생일인 친구들
  eventCount: number;        // 그 날짜 활성 이벤트 수
};

export type CalendarMonthResp = {
  calendar: {
    year: number;
    month: number;
    birthdays: CalendarMonthItem[];
  };
};

export type CalendarDateDetailResp = {
  date: string; // "YYYY-MM-DD"
  birthdays: { friend: { id: number; name: string } }[];
};

/** ---------- APIs ---------- */
// 특정 월의 생일 달력 조회
export async function getBirthdaysCalendar(params?: { year?: number; month?: number }) {
  const { year, month } = params ?? {};
  const { data } = await instance.get("/calendar/birthdays", {
    params: { year, month },
  });
  return data.success as CalendarMonthResp["calendar"];
}

// 특정 날짜의 상세 조회
export async function getBirthdaysByDate(date: string) {
  const { data } = await instance.get(`/calendar/birthdays/${date}`);
  return data.success as CalendarDateDetailResp;
}
