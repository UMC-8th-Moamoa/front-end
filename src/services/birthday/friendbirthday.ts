// services/birthday/friendbirthday.ts
import instance from "../../api/axiosInstance";

/** ------------------ Types ------------------ */
export type BirthdayCountdown = {
  user: { id: number; name: string; birthday: string }; // ISO
  countdown: {
    daysRemaining: number;
    formattedDaysRemaining: string; // 예: "D-34"
    birthdayThisYear: string;       // ISO
    isBirthdayToday: boolean;
    isBirthdayPassed: boolean;
    message: string;
  };
};

export type LetterHomeItem = {
  birthdayEventId: number;
  birthdayPersonName: string;
  birthdayPersonPhoto: string | null;
  birthday: string;             // "2025-08-23"
  hasLetter: boolean;
  letterId: number | null;
  lastModified: string | null;  // ISO
  daysLeft: number;             // D-day
};

export type LetterHomeResponse = {
  letters: LetterHomeItem[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
  };
};

/** ------- Upcoming Birthdays (새로 추가) ------- */
export type UpcomingFriend = {
  friend: {
    id: number;
    name: string;
    photo?: string | null;
  };
  birthday: {
    date: string;        // "2001-08-23"
    displayDate: string; // "8월 23일"
    dDay: number;        // 0~6
  };
  eventId: number;       // 자동 생성된(또는 예정) 이벤트 ID
};

export type UpcomingPagination = {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
  totalCount: number;
};

export type UpcomingResponse = {
  upcomingBirthdays: UpcomingFriend[];
  pagination: UpcomingPagination;
};

/** ------------------ APIs ------------------ */
// 1) 현재 로그인 사용자의 생일 카운트다운
export async function getMyBirthdayCountdown() {
  const { data } = await instance.get("/api/users/me/birthday-countdown");
  return data.success as BirthdayCountdown;
}

// 2) 홈 편지 목록 (스와이프/커서 페이징)
export async function getLetterHome(params?: {
  limit?: number;                 // 기본 3
  cursor?: string | null;         // Base64
  direction?: "next" | "prev";    // 기본 next
}) {
  const { limit = 3, cursor, direction = "next" } = params ?? {};
  const { data } = await instance.get("/api/home/letters", {
    params: { limit, cursor, direction },
  });
  return data.success as LetterHomeResponse;
}

// 3) 다가오는 친구 생일 (7일 이내, 스와이프/커서)
export async function getUpcomingBirthdays(params?: {
  limit?: number;                 // 1~10, 기본 3
  cursor?: string | null;         // Base64 인코딩 JSON
  direction?: "next" | "prev";    // 기본 next
}) {
  const { limit = 3, cursor, direction = "next" } = params ?? {};
  const { data } = await instance.get("/api/birthdays/upcoming", {
    params: { limit, cursor, direction },
  });
  return data.success as UpcomingResponse;
}
