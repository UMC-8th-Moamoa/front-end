import instance from "../../api/axiosInstance";

/** ---------- 검색 결과 ---------- */
export type UserSearchItem = {
  id: number;
  userId: string;
  name: string;
  photo: string | null;
  birthday: string;
  isFollowing: boolean;
  isFollower: boolean;
  followersCount: number;
  followingCount: number;
};

export type UserSearchPagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type ApiEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: T;
};

type SearchRawResponse = ApiEnvelope<{
  users: UserSearchItem[];
  pagination: UserSearchPagination;
}>;

export async function searchUsers(
  q: string,
  opts?: { limit?: number; page?: number }
): Promise<{ users: UserSearchItem[]; pagination: UserSearchPagination }> {
  const { limit = 10, page = 1 } = opts ?? {};
  if (!q?.trim()) {
    return {
      users: [],
      pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false },
    };
  }
  const { data } = await instance.get<SearchRawResponse>("/users/search", {
    params: { q, limit, page },
  });
  if (data.resultType !== "SUCCESS" || !data.success) {
    return {
      users: [],
      pagination: { currentPage: page, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: page > 1 },
    };
  }
  const { users, pagination } = data.success;
  return { users: users ?? [], pagination };
}

/** ---------- 최근 검색(유저로 변환) ---------- */
export type RecentUserHistoryItem = {
  id: number;          // 히스토리 row id (삭제용)
  searchedAt: string;  // ISO
  user: {
    id: number;
    userId: string;    // 라우팅 핸들
    name: string;
    photo: string | null;
  };
};

/** 문자 기록 타입(백엔드 문서된 엔드포인트) */
type TextHistoryResp = ApiEnvelope<{
  searchHistory: Array<{
    id: number;
    searchTerm: string;   // 사용자가 입력해서 저장된 문자열
    searchedAt: string;
  }>;
}>;

/** 문자열 기록 -> 유저 매핑 시 “가장 그럴듯한” 결과 하나 고르기 */
function pickBestMatch(term: string, candidates: UserSearchItem[]): UserSearchItem | null {
  if (!candidates?.length) return null;
  const lower = term.toLowerCase();

  // 1) userId 완전 일치
  const exactHandle = candidates.find(u => u.userId?.toLowerCase() === lower);
  if (exactHandle) return exactHandle;

  // 2) 이름 완전 일치
  const exactName = candidates.find(u => u.name?.toLowerCase() === lower);
  if (exactName) return exactName;

  // 3) userId 포함
  const containsHandle = candidates.find(u => u.userId?.toLowerCase().includes(lower));
  if (containsHandle) return containsHandle;

  // 4) 이름 포함
  const containsName = candidates.find(u => u.name?.toLowerCase().includes(lower));
  if (containsName) return containsName;

  // 5) 첫 번째
  return candidates[0] ?? null;
}

/** 최근 검색한 '유저' 리스트(최대 n개). 전용 API가 없으므로 문자열 기록을 받아 유저로 매핑 */
export async function fetchRecentSearchedUsers(limit = 10): Promise<RecentUserHistoryItem[]> {
  // 문자열 기록을 넉넉히 받아와서(중복/미매칭 제외 대비) 상위 limit개만 반환
  const take = Math.max(limit, 20);
  const { data } = await instance.get<TextHistoryResp>("/users/search/history", {
    params: { limit: take },
  });
  const rows = data.resultType === "SUCCESS" && data.success ? data.success.searchHistory ?? [] : [];
  if (!rows.length) return [];

  const settled = await Promise.allSettled(
    rows.map(async (r) => {
      const { users } = await searchUsers(r.searchTerm, { limit: 5, page: 1 });
      const picked = pickBestMatch(r.searchTerm, users);
      if (!picked) return null;
      return {
        id: r.id,
        searchedAt: r.searchedAt,
        user: {
          id: picked.id,
          userId: picked.userId,
          name: picked.name,
          photo: picked.photo,
        },
      } as RecentUserHistoryItem;
    })
  );

  // null/실패 제외 + 같은 userId 중복 제거
  const uniq: Record<string, boolean> = {};
  const mapped: RecentUserHistoryItem[] = [];
  for (const s of settled) {
    if (s.status !== "fulfilled" || !s.value) continue;
    const uId = s.value.user.userId;
    if (uniq[uId]) continue;
    uniq[uId] = true;
    mapped.push(s.value);
    if (mapped.length >= limit) break;
  }

  return mapped;
}

/** 유저 검색 기록 저장(전용 API 없으므로 문자열 기록으로 저장) */
export async function createUserSearchHistoryByHandle(userHandle: string): Promise<number | null> {
  const { data } = await instance.post<ApiEnvelope<{ id: number }>>(
    "/users/search/history",
    { searchTerm: userHandle }
  );
  return data.resultType === "SUCCESS" && data.success ? data.success.id : null;
}

/** 개별 삭제 */
export async function deleteRecentSearchedUser(historyId: number): Promise<boolean> {
  const { data } = await instance.delete<ApiEnvelope<{ message: string }>>(
    `/users/search/history/${historyId}`
  );
  return data.resultType === "SUCCESS";
}
