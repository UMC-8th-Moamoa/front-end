// src/services/letters.ts
import instance from "../api/axiosInstance";

/** === 스웨거 스키마대로 타입 정의 === */

// 목록 아이템 (스웨거 Example 포함 필드)
export type LetterListItem = {
  id: number;
  senderId: number;
  title: string;
  letterPaperId: number;
  envelopeId: number;
  envelopeImageUrl: string; // 목록에도 포함됨 (스웨거 캡쳐 기준)
};

// 공통 페이징 응답
export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

// 상세/등록/수정 응답 (스웨거 예시 기반)
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

// 등록 바디
export type CreateLetterPayload = {
  birthdayEventId: number;
  senderId: number;    // 백에서 토큰으로 추론하도록 전환 가능
  receiverId: number;
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string; // 업로드 URL (DataURL 금지)
};

// 수정 바디 (PATCH)
export type UpdateLetterPayload = {
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
};

/** === 안전 보정 유틸 ===
 * eventId/유저ID/이미지URL이 아직 시스템에 안 붙었을 때도
 * 프론트가 바로 동작하도록 임시값을 채우는 보조 함수들입니다.
 * 실제 연결 시 이 부분만 교체하면 나머지 코드는 그대로 갑니다.
 */

// 이벤트 ID 보정: 명시값 > .env > 1
function pickEventId(input?: number): number {
  if (typeof input === "number" && input > 0) return input;
  const envId = Number(import.meta.env.VITE_DEV_BIRTHDAY_EVENT_ID);
  if (!Number.isNaN(envId) && envId > 0) return envId;
  return 1;
}

// 유저 ID 보정: 명시값 > localStorage(userId) > .env > 1
function pickUserId(input?: number): number {
  if (typeof input === "number" && input > 0) return input;
  const fromLS = Number(localStorage.getItem("userId"));
  if (!Number.isNaN(fromLS) && fromLS > 0) return fromLS;
  const envUser = Number(import.meta.env.VITE_DEV_USER_ID);
  if (!Number.isNaN(envUser) && envUser > 0) return envUser;
  return 1;
}

// 업로드 전 DataURL 방지(백이 멀티파트 업로드 URL을 요구하므로)
function sanitizeEnvelopeImage(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("data:")) return ""; // 업로드 붙이면 여기서 업로드→URL 치환
  return url;
}

/** === API 함수들 === */

// 1) 편지 목록 조회 (GET /api/letters?birthdayEventId=&page=&size=)
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

// 2) 편지 등록 (POST /api/letters)
export async function createLetter(payload: CreateLetterPayload): Promise<LetterDetail> {
  const body: CreateLetterPayload = {
    ...payload,
    birthdayEventId: pickEventId(payload.birthdayEventId),
    senderId: pickUserId(payload.senderId), // 백에서 토큰 추론으로 바꾸면 이 필드 제거 가능
    receiverId: pickUserId(payload.receiverId),
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };
  const { data } = await instance.post<LetterDetail>("/letters", body);
  return data;
}

// 3) 편지 상세 조회 (GET /api/letters/{id})
export async function getLetterById(id: number): Promise<LetterDetail> {
  const { data } = await instance.get<LetterDetail>(`/letters/${id}`);
  return data;
}

// 4) 편지 수정 (PATCH /api/letters/{id})
export async function updateLetter(id: number, payload: UpdateLetterPayload): Promise<LetterDetail> {
  const body: UpdateLetterPayload = {
    ...payload,
    envelopeImageUrl: sanitizeEnvelopeImage(payload.envelopeImageUrl),
  };
  const { data } = await instance.patch<LetterDetail>(`/letters/${id}`, body);
  return data;
}
