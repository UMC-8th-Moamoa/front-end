// src/services/user/search.ts
import instance from "../../api/axiosInstance";

/** ---------- Types (검색 결과) ---------- */
export type UserSearchItem = {
  id: number;
  userId: string;
  name: string;
  photo: string | null;
  birthday: string; // "YYYY-MM-DD"
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

type SearchRawResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    users: UserSearchItem[];
    pagination: UserSearchPagination;
  };
};

/** 사용자 검색 */
export async function searchUsers(
  q: string,
  opts?: { limit?: number; page?: number }
): Promise<{ users: UserSearchItem[]; pagination: UserSearchPagination }> {
  const { limit = 10, page = 1 } = opts ?? {};

  if (!q?.trim()) {
    return {
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const { data } = await instance.get<SearchRawResponse>("/users/search", {
    params: { q, limit, page },
  });

  if (data.resultType !== "SUCCESS" || !data.success) {
    return {
      users: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
        hasNext: false,
        hasPrev: page > 1,
      },
    };
  }

  const { users, pagination } = data.success;
  return { users: users ?? [], pagination };
}

/** ---------- Types (검색 히스토리) ---------- */
export type SearchHistoryItem = {
  id: number;
  searchTerm: string;
  searchedAt: string; // ISO
};

type HistoryListResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: {
    searchHistory: SearchHistoryItem[];
  };
};

type HistoryDeleteResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: string | null;
  success?: { message: string };
};

/** 검색 기록 조회 */
export async function fetchSearchHistory(limit = 10): Promise<SearchHistoryItem[]> {
  const { data } = await instance.get<HistoryListResponse>("/users/search/history", {
    params: { limit },
  });
  return data.resultType === "SUCCESS" && data.success
    ? data.success.searchHistory ?? []
    : [];
}

/** 검색 기록 삭제 */
export async function deleteSearchHistory(historyId: number): Promise<boolean> {
  const { data } = await instance.delete<HistoryDeleteResponse>(
    `/users/search/history/${historyId}`
  );
  return data.resultType === "SUCCESS";
}
