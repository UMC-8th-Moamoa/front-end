// src/services/wishlist/vote.ts
import instance from "../../api/axiosInstance";

/** -------- 공통 타입 -------- */
export type VoteListItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  totalVotes: number;    // 스펙상 있거나 0일 수 있음
  userVoted: boolean;    // 내가 이 항목에 이미 투표했는지
  addedAt: string;       // ISO
};

export type VoteListSuccess = {
  event: { id: number; birthdayPersonName: string };
  wishlists: VoteListItem[];
};

export type VoteResultsItem = {
  itemId: number;
  name: string;
  price: number;
  image: string;
  voteCount: number;
  userVoted: boolean;
};

export type VoteResultsSuccess = {
  event: { id: number; birthdayPersonName: string };
  userHasVoted: boolean;
  results: VoteResultsItem[];
};

/** -------- GET: 투표용 위시리스트 --------
 *  GET /api/birthdays/events/{eventId}/wishlist/vote
 */
export async function getWishlistForVote(eventId: number) {
  const { data } = await instance.get(`/birthdays/events/${eventId}/wishlist/vote`);
  // 스웨거의 200 응답 success 필드 그대로 반환
  return data.success as VoteListSuccess;
}

/** -------- POST: 투표하기 --------
 *  POST /api/birthdays/events/{eventId}/wishlist/vote
 *  body: { wishlistIds: number[] }
 *  (여러 개 허용 스펙이지만 단일 선택도 가능)
 */
export async function submitWishlistVote(eventId: number, wishlistIds: number[]) {
  const { data } = await instance.post(`/birthdays/events/${eventId}/wishlist/vote`, {
    wishlistIds,
  });
  // 보통 { resultType, error, success } 형태. 메시지 정도만 있을 수 있음
  return data.success as { message?: string } | undefined;
}

/** -------- GET: 투표 결과 --------
 *  GET /api/birthdays/events/{eventId}/wishlist/vote/results
 */
export async function getWishlistVoteResults(eventId: number) {
  const { data } = await instance.get(`/birthdays/events/${eventId}/wishlist/vote/results`);
  return data.success as VoteResultsSuccess;
}

/** -------- UI 매핑(선택) -------- */
export type VoteUiItem = {
  id: number;
  imageUrl: string;
  title: string;
  price: number;
  totalVotes?: number;
  userVoted?: boolean;
};

export function toUiItems(list: VoteListItem[]): VoteUiItem[] {
  return (list ?? []).map((i) => ({
    id: i.id,
    imageUrl: i.image,
    title: i.name,
    price: i.price,
    totalVotes: i.totalVotes,
    userVoted: i.userVoted,
  }));
}
