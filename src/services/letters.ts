// src/services/letters.ts
import instance from "../api/axiosInstance";

/** === 스웨거 스키마대로 타입 정의 === */

// 목록 아이템
export type LetterListItem = {
  id: number;
  senderId: number;
  title: string;
  letterPaperId: number;
  envelopeId: number;
  envelopeImageUrl: string;
};

// 공통 페이징 응답
export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

// 상세/등록/수정 응답
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
  sentAt: string;             // ISO datetime
  readAt?: string | null;
};

// 등록 바디
export type CreateLetterPayload = {
  birthdayEventId: number;
  senderId: number;
  receiverId: number;
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
};

// 수정 바디
export type UpdateLetterPayload = {
  content: string;
  letterPaperId: number;
  envelopeId: number;
  fontId: number;
  envelopeImageUrl: string;
};

/** === API 함수들 (스웨거 경로/쿼리 그대로) === */

// 1) 편지 목록 조회 (GET /letters?birthdayEventId=&page=&size=)
export async function getLetters(
  birthdayEventId: number,
  page = 1,
  size = 15
): Promise<PageResponse<LetterListItem>> {
  const { data } = await instance.get<PageResponse<LetterListItem>>("/letters", {
    params: { birthdayEventId, page, size },
  });
  return data;
}

// 2) 편지 등록 (POST /letters)
export async function createLetter(payload: CreateLetterPayload): Promise<LetterDetail> {
  const { data } = await instance.post<LetterDetail>("/letters", payload);
  return data;
}

// 3) 편지 상세 조회 (GET /letters/{id})
export async function getLetterById(id: number): Promise<LetterDetail> {
  const { data } = await instance.get<LetterDetail>(`/letters/${id}`);
  return data;
}

// 4) 편지 수정 (PUT /letters/{id})
export async function updateLetter(id: number, payload: UpdateLetterPayload): Promise<LetterDetail> {
  const { data } = await instance.put<LetterDetail>(`/letters/${id}`, payload);
  return data;
}
