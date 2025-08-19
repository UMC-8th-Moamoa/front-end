// src/components/HomePage/Search/RecentSearchList.tsx
import { useEffect, useState } from "react";
import SearchUserItem from "./SearchUserItem";
import {
  fetchRecentSearchedUsers,
  deleteRecentSearchedUser,
  type RecentUserHistoryItem,
} from "../../../services/user/search";

const RecentSearchList = () => {
  const [items, setItems] = useState<RecentUserHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const list = await fetchRecentSearchedUsers(10); // 최대 10개
      setItems(list);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "최근 검색을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (historyId: number) => {
    try {
      const ok = await deleteRecentSearchedUser(historyId);
      if (ok) setItems((prev) => prev.filter((i) => i.id !== historyId));
    } catch {
      alert("삭제에 실패했어요. 잠시 뒤 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[350px] px-4 space-y-2">
        <h2 className="text-[16px] font-semibold text-[#6282E1] mb-2">최근 검색</h2>

        {loading && <div className="py-6 text-center">불러오는 중…</div>}
        {err && <div className="py-6 text-center text-red-500">{err}</div>}
        {!loading && !err && items.length === 0 && (
          <div className="py-6 text-center">최근에 검색한 유저가 없어요</div>
        )}

        {!loading &&
          !err &&
          items.map((h) => (
            <SearchUserItem
              key={h.id}
              name={h.user.name}
              userId={h.user.userId}
              photo={h.user.photo ?? "/assets/profile.svg"}
              showDeleteButton
              onDelete={() => handleDelete(h.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default RecentSearchList;
