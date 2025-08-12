// api/letters.ts
import { http } from '../lib/http';

export type LetterItem = {
  id: number;
  birthdayEventId: number;
  senderId: number;
  receiverId: number;
  content: string;
  letterPaperId: number | null;
  envelopeId: number | null;
  envelopeImageUrl?: string | null;
  sentAt?: string;
  title?: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

// NOTE: http.baseURL === '' 인 경우
const BASE = 'letters';

// 목록 조회
export async function getLetters(birthdayEventId: number, page = 1, size = 15) {
  const { data } = await http.get<PageResponse<LetterItem>>(BASE, {
    params: { birthdayEventId, page, size },
  });
  return data;
}

// 편지 등록 (Swagger 201)
export async function createLetter(payload: {
  birthdayEventId: number;
  senderId: number;
  receiverId: number;
  content: string;
  letterPaperId: number;
  envelopeId: number;
  envelopeImageUrl?: string;
}) {
  const { data } = await http.post<LetterItem>(BASE, payload);
  return data;
}

// 편지 수정 (Swagger 200)
export async function updateLetter(
  id: number,
  payload: Partial<Pick<LetterItem, 'content' | 'letterPaperId' | 'envelopeId' | 'envelopeImageUrl'>>
) {
  const { data } = await http.patch<LetterItem>(`${BASE}/${id}`, payload);
  return data;
}

// 편지 상세조회
export async function getLetterById(id: number) {
  const { data } = await http.get<LetterItem>(`${BASE}/${id}`);
  return data;
}

