import instance from "../api/axiosInstance";
import { getMyUserId } from "./mypage";

/** === 스웨거 스키마대로 타입 정의 === */
export type LetterListItem = {
  id: number;
  senderId: number;
  title: string;
  letterPaperId: number;
  envelopeId: number;
  envelopeImageUrl: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export type LetterDetail = {
  id: number;
  birthdayEventId: number;
  senderId: number; // ★ number로 통일
  receiverId: number; // ★ number로 통일
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
  sentAt: string;
  readAt?: string | null;
};

export type CreateLetterPayload = {
  birthdayEventId: number;
  senderId: number; // ★ number로 통일
  receiverId: number; // ★ number로 통일
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
};

export type UpdateLetterPayload = {
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
};

function pickEventId(input?: number): number {
  if (typeof input === "number" && input > 0) return input;
  const envId = Number(import.meta.env.VITE_DEV_BIRTHDAY_EVENT_ID);
  if (!Number.isNaN(envId) && envId > 0) return envId;
  return 1;
}

function pickUserId(input?: number): number {
  if (typeof input === "number" && input > 0) return input;
  const fromLS = Number(localStorage.getItem("my_user_id"));
  if (!Number.isNaN(fromLS) && fromLS > 0) return fromLS;
  const envUser = Number(import.meta.env.VITE_DEV_USER_ID);
  if (!Number.isNaN(envUser) && envUser > 0) return envUser;
  return 1;
}

function sanitizeEnvelopeImage(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("data:")) return "";
  return url;
}

export async function getLetters(
  birthdayEventId: number,
  page = 1,
  size = 15
): Promise<PageResponse<LetterListItem>> {
  const safeEventId = pickEventId(birthdayEventId);
  const { data } = await instance.get<PageResponse<LetterListItem>>("/letters", {
    params: { birthdayEventId: safeEventId, page, size },
  });
  return data;
}

export async function createLetter(payload: CreateLetterPayload): Promise<LetterDetail> {
  // DEBUG LOG ADDED: createLetter 서비스 함수가 받은 payload 확인
  console.log("[DEBUG] Service: createLetter received payload:", payload);

  const body = {
    ...payload,
    birthdayEventId: pickEventId(payload.birthdayEventId),
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };

  if (!body.senderId || isNaN(body.senderId) || body.senderId <= 0) {
    // DEBUG LOG ADDED: senderId가 유효하지 않을 경우 에러와 함께 로그 출력
    console.error("[DEBUG] Service: Invalid senderId in createLetter body:", body.senderId);
    throw new Error("Invalid senderId provided.");
  }

  const { data } = await instance.post<LetterDetail>("/letters", body);
  return data;
}

export async function getLetterById(id: number): Promise<LetterDetail> {
  // DEBUG LOG ADDED: 특정 편지 조회 시 ID 확인
  console.log("[DEBUG] Service: getLetterById called with ID:", id);
  const { data } = await instance.get<LetterDetail>(`/letters/${id}`);
  return data;
}

export async function updateLetter(id: number, payload: UpdateLetterPayload): Promise<LetterDetail> {
  // DEBUG LOG ADDED: updateLetter 서비스 함수가 받은 payload 확인
  console.log("[DEBUG] Service: updateLetter received for ID:", id, "with payload:", payload);

  const body: UpdateLetterPayload = {
    ...payload,
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };
  const { data } = await instance.patch<LetterDetail>(`/letters/${id}`, body);
  return data;
}