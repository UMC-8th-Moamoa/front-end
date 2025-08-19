// src/services/user/event.ts
import instance from "../../api/axiosInstance";

/** 공통 응답 Envelope */
type ApiEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: T;
};

/** --------- 참여 화면용 DTO (/birthdays/events/{eventId}/participation) ---------- */
export type EventButtonStatus = {
  // 백엔드 명세에 맞춘 필드들
  type:
    | "NOT_PARTICIPATED"
    | "PARTICIPATED_NO_LETTER"
    | "PARTICIPATED_WITH_LETTER"
    | string;
  message: string;
  buttonText: string;
  buttonAction: "PARTICIPATE" | "WRITE_LETTER" | "EDIT_LETTER" | string;
  isEnabled: boolean;
};

export type ParticipationScreenDTO = {
  event: {
    id: number;
    birthdayPersonName: string;
    deadline: string; // ISO
    status: string;   // "active" | "expired" | ...
  };
  countdown: {
    timeRemaining: string;        // "48:14:30"
    deadlineFormatted: string;    // "8월 23일 23:59"
  };
  participation: {
    currentUserParticipated: boolean;
    participationCount: number;
    hasWrittenLetter: boolean;
  };
  buttonStatus: EventButtonStatus;
};

export async function getEventParticipationMeta(
  eventId: number
): Promise<ParticipationScreenDTO> {
  const { data } = await instance.get<ApiEnvelope<ParticipationScreenDTO>>(
    `/birthdays/events/${eventId}/participation`
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error(data.error ?? "FAILED_TO_FETCH_PARTICIPATION");
  }
  return data.success;
}

/** --------- 상세 조회 (위시리스트 등 기존 화면에서 사용) ---------- */
// 기존 상세 타입(백엔드 스펙과 다르면 필요한 필드만 남겨도 됩니다)
export type BirthdayEventDetail = {
  event: {
    id: number;
    deadline: string;   // ISO
    status: string;
    createdAt?: string; // ISO
  };
  birthdayPerson: {
    id?: number;
    name: string;
    photo: string | null;
    birthday: string; // ISO
  };
  countdown?: {
    daysRemaining: number;
    formattedDaysRemaining?: string; // e.g. "D-7"
    isBirthdayToday?: boolean;
  };
  participants: {
    totalCount?: number;
    currentUserParticipated?: boolean;
    list: Array<{
      userId: number;
      userName: string;
      userPhoto: string | null;
      participatedAt?: string; // ISO
    }>;
  };
  buttonInfo?: EventButtonStatus; // (백엔드가 제공하면 폴백용)
  wishlist: null | {
    totalCount: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      image: string | null;
      createdAt: string; // ISO
    }>;
  };
};

export async function getBirthdayEventDetail(eventId: number): Promise<BirthdayEventDetail> {
  const { data } = await instance.get<ApiEnvelope<BirthdayEventDetail>>(
    `/birthdays/events/${eventId}`
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error(data.error ?? "FAILED_TO_FETCH_EVENT_DETAIL");
  }
  return data.success;
}

/** --------- 참여(송금/무송금) ---------- */
export type ParticipationType = "WITH_MONEY" | "WITHOUT_MONEY";
export type ParticipateBody = {
  participationType: ParticipationType;
  amount: number; // 무송금이면 0
};
export type ParticipateSuccess = {
  participation: {
    id: number;
    eventId: number;
    userId: number;
    amount: number;
    participationType: ParticipationType;
    participatedAt: string; // ISO
  };
  event: {
    currentAmount: number;
    participantCount: number;
  };
};

export async function participateInEvent(
  eventId: number,
  body: ParticipateBody
): Promise<ParticipateSuccess> {
  const { data } = await instance.post<ApiEnvelope<ParticipateSuccess>>(
    `/birthdays/events/${eventId}/participation`,
    body
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error(data.error ?? "FAILED_TO_PARTICIPATE");
  }
  return data.success;
}

/** --------- MemberWishList에서 쓰는 UI 모델 ---------- */
export type WishlistUi = {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt?: string;
};

export function mapRecipientWishlistUiFromDetail(
  detail: BirthdayEventDetail,
  page = 1,
  size = 10
): {
  recipientName: string;
  items: WishlistUi[];
  pagination: { currentPage: number; totalPages: number; totalItems: number };
} {
  const all = detail.wishlist?.items ?? [];
  const start = (page - 1) * size;
  const end = start + size;

  const items = all.slice(start, end).map((w) => ({
    id: w.id,
    title: w.name,
    price: w.price,
    imageUrl: w.image ?? null,
    createdAt: w.createdAt,
  }));

  const totalItems = detail.wishlist?.totalCount ?? all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));

  return {
    recipientName: detail.birthdayPerson?.name ?? "",
    items,
    pagination: { currentPage: page, totalPages, totalItems },
  };
}
