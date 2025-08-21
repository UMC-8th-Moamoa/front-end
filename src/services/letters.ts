// src/services/letters.ts
import instance from "../api/axiosInstance";

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
  senderId: number;
  receiverId: number;
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
  senderId: number;
  receiverId: number;
  content: string;
  letterPaperId: number; // holditem_id
  envelopeId: number;    // holditem_id
  fontId: number;        // holditem_id
  envelopeImageUrl: string; // 업로드 URL 권장
};

export type UpdateLetterPayload = {
  content: string;
  letterPaperId: number; // holditem_id
  envelopeId: number;    // holditem_id
  fontId: number;        // holditem_id
  envelopeImageUrl: string; // 업로드 URL 권장
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
  if (url.startsWith("data:")) return ""; // dataURL은 서버에 보내지 않음
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
  console.log("[DEBUG] Service: createLetter received payload:", payload);

  const body = {
    ...payload,
    birthdayEventId: pickEventId(payload.birthdayEventId),
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };

  // 필수 ID 유효성 로그
  if (!body.letterPaperId || body.letterPaperId <= 0) {
    console.error("[DEBUG] Service: invalid letterPaperId", body.letterPaperId);
  }
  if (body.envelopeId != null && body.envelopeId < 0) {
    console.error("[DEBUG] Service: invalid envelopeId", body.envelopeId);
  }
  if (body.fontId != null && body.fontId < 0) {
    console.error("[DEBUG] Service: invalid fontId", body.fontId);
  }

  if (!body.senderId || isNaN(body.senderId) || body.senderId <= 0) {
    console.error("[DEBUG] Service: Invalid senderId in createLetter body:", body.senderId);
    throw new Error("Invalid senderId provided.");
  }

  const { data } = await instance.post<LetterDetail>("/letters", body);
  return data;
}

export async function getLetterById(id: number): Promise<LetterDetail> {
  console.log("[DEBUG] Service: getLetterById called with ID:", id);
  const { data } = await instance.get<LetterDetail>(`/letters/${id}`);
  return data;
}

export async function updateLetter(id: number, payload: UpdateLetterPayload): Promise<LetterDetail> {
  console.log("[DEBUG] Service: updateLetter received for ID:", id, "with payload:", payload);

  const body: UpdateLetterPayload = {
    ...payload,
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };
  const { data } = await instance.patch<LetterDetail>(`/letters/${id}`, body);
  return data;
}
