// src/services/birthday/event.ts
import instance from "../../api/axiosInstance";

/** --------- 상세 조회 (참여자/카운트다운/위시리스트 포함) ---------- */
export type BirthdayEventDetail = {
  event: {
    id: number;
    deadline: string;   // ISO
    status: string;     // "active" | "expired" | ...
    createdAt: string;  // ISO
  };
  birthdayPerson: {
    id: number;
    name: string;
    photo: string | null;
    birthday: string;   // ISO
  };
  countdown: {
    daysRemaining: number;
    formattedDaysRemaining: string; // e.g. "D-7"
    isBirthdayToday: boolean;
  };
  participants: {
    totalCount: number;
    currentUserParticipated: boolean;
    list: Array<{
      userId: number;
      userName: string;
      userPhoto: string | null;
      participatedAt?: string; // ISO
    }>;
  };
  wishlist: null | {
    totalCount: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      image: string;
      createdAt: string; // ISO
    }>;
  };
};

export async function getBirthdayEventDetail(eventId: number) {
  const { data } = await instance.get(`/birthdays/events/${eventId}`);
  return data.success as BirthdayEventDetail;
}

/** --------- 참여 화면용 메타 (마감시간/참여 현황 + 버튼상태) ---------- */
export type ButtonStatusType =
  | "NOT_PARTICIPATED"
  | "PARTICIPATED_NO_LETTER"
  | "PARTICIPATED_WITH_LETTER";

export type ButtonAction = "PARTICIPATE" | "WRITE_LETTER" | "EDIT_LETTER";

export type EventButtonStatus = {
  type: ButtonStatusType;
  message: string;
  buttonText: string;     // 예: "모아 참여하기", "편지 작성하러 가기", "편지 수정하기"
  buttonAction: ButtonAction;
  isEnabled: boolean;
};

export type EventParticipationMeta = {
  event: {
    id: number;
    birthdayPersonName: string;
    deadline: string;
    status: string;
  };
  countdown: {
    timeRemaining: string;
    deadlineFormatted: string;
  };
  participation: {
    currentUserParticipated: boolean;
    participationCount: number;
    hasWrittenLetter?: boolean; // 서버가 내려주면 사용
  };
  buttonStatus: EventButtonStatus; // ✅ 추가
};

export async function getEventParticipationMeta(eventId: number) {
  const { data } = await instance.get(`/birthdays/events/${eventId}/participation`);
  return data.success as EventParticipationMeta;
}

/** --------- 참여(송금/무송금) ---------- */
export type ParticipationType = "WITH_MONEY" | "WITHOUT_MONEY";

export type ParticipateBody = {
  participationType: ParticipationType; // "WITH_MONEY" | "WITHOUT_MONEY"
  amount: number;                       // 무송금이면 0
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

export async function participateInEvent(eventId: number, body: ParticipateBody) {
  const { data } = await instance.post(`/birthdays/events/${eventId}/participation`, body);
  return data.success as ParticipateSuccess;
}
