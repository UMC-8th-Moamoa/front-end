// services/birthday/share.ts
import instance from "../../api/axiosInstance";
import { getMyBirthdayEvent } from "./mybirthday";

/** ---------- Types ---------- */
export type ShareLinkRequest = {
  contentType: "URL";
  expiresAt: string; // ISO
};

export type ShareLinkResponse = {
  shareUrl: string;
  shareText: string;
  expiresAt: string; // ISO
};

export type SharedEventMeta = {
  eventId: number;
  birthdayPersonName: string;
  deadline: string; // ISO
  status: string;   // "active" | "expired" | ...
};

/** 만료시각 기본값: 현재 기준 +7일 */
function defaultExpiresISO(): string {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

/** Date | string -> ISO 문자열로 정규화 */
function toISO(v?: string | Date): string {
  if (!v) return defaultExpiresISO();
  if (v instanceof Date) return v.toISOString();
  return v;
}

/** POST /birthdays/events/{eventId}/share
 *  공유 URL 생성 (만료시각은 기본 +7일)
 */
export async function createShareUrl(
  eventId: number,
  opts?: { expiresAt?: string | Date; contentType?: "URL" }
): Promise<ShareLinkResponse> {
  const body: ShareLinkRequest = {
    contentType: opts?.contentType ?? "URL",
    expiresAt: toISO(opts?.expiresAt),
  };

  const { data } = await instance.post(`/birthdays/events/${eventId}/share`, body);
  // { resultType: "SUCCESS", success: { shareUrl, shareText, expiresAt } }
  return data.success as ShareLinkResponse;
}

/** GET /birthdays/events/shared/{token}
 *  공유 토큰으로 이벤트 메타 조회 (공유 링크 접속 시 사용)
 */
export async function getSharedEventByToken(token: string): Promise<SharedEventMeta> {
  const { data } = await instance.get(`/birthdays/events/shared/${token}`);
  return data.success as SharedEventMeta;
}

/** 유틸: shareUrl에서 token 추출 (예: https://.../join?token=abc -> abc) */
export function extractShareToken(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get("token");
  } catch {
    return null;
  }
}
