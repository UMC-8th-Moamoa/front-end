import instance from "../../api/axiosInstance";

export type VoteListItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  totalVotes: number;
  userVoted: boolean;
  addedAt: string;
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

const unwrap = (d: any) => d?.success ?? d;

/** GET: 투표용 위시리스트 (단수) */
export async function getWishlistForVote(eventId: number) {
  const { data } = await instance.get(
    `/birthdays/events/${eventId}/wishlist/vote`
  );
  return unwrap(data) as VoteListSuccess;
}

/** POST: 투표하기 (단수) */
export async function submitWishlistVote(eventId: number, wishlistIds: number[]) {
  const { data } = await instance.post(
    `/birthdays/events/${eventId}/wishlist/vote`,
    { wishlistIds }
  );
  return unwrap(data) as { message?: string } | undefined;
}

/** GET: 투표 결과 (단수) */
export async function getWishlistVoteResults(eventId: number) {
  const { data } = await instance.get(
    `/birthdays/events/${eventId}/wishlist/vote/results`
  );
  return unwrap(data) as VoteResultsSuccess;
}

/** UI 매핑 */
export type VoteUiItem = {
  id: number;
  imageUrl: string;
  title: string;
  price: number;
  totalVotes?: number;
  userVoted?: boolean;
};

export function toUiItems(list: VoteListItem[]): VoteUiItem[] {
  return (list ?? []).map((i: any) => ({
    id: i.id,
    imageUrl: i.image ?? i.imageUrl ?? i.productImageUrl ?? "",
    title: i.name ?? i.productName ?? i.title ?? "",
    price: i.price ?? 0,
    totalVotes: i.totalVotes ?? i.voteCount,
    userVoted: i.userVoted,
  }));
}
