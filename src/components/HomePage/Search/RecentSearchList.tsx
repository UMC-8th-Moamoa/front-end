// src/components/HomePage/Search/RecentSearchList.tsx
import { useEffect, useState } from "react";
import SearchUserItem from "./SearchUserItem";
import {
  fetchSearchHistory,
  deleteSearchHistory,
  type SearchHistoryItem,
} from "../../../services/user/search";

const RecentSearchList = () => {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const list = await fetchSearchHistory(10);
      setItems(list);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "검색 기록을 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (historyId: number) => {
    try {
      const ok = await deleteSearchHistory(historyId);
      if (ok) setItems((prev) => prev.filter((i) => i.id !== historyId));
    } catch (e) {
      // 실패해도 사용자에겐 간단히 표시
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
          <div className="py-6 text-center">검색 기록이 없어요</div>
        )}

        {!loading &&
          !err &&
          items.map((h) => (
            <SearchUserItem
              key={h.id}
              name={h.searchTerm}   // 최근 검색어를 이름 자리에 노출
              userId=""             // 보조 텍스트는 비움
              photo={null}          // 프로필 없음
              showDeleteButton
              onDelete={() => handleDelete(h.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default RecentSearchList;
