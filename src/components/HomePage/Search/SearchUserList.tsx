// src/components/HomePage/Search/SearchUserList.tsx
import { useEffect, useState } from "react";
import SearchUserItem from "./SearchUserItem";
import { searchUsers, type UserSearchItem } from "../../../services/user/search";

interface SearchUserListProps {
  keyword: string;
}

const SearchUserList = ({ keyword }: SearchUserListProps) => {
  const [items, setItems] = useState<UserSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!keyword.trim()) {
        setItems([]);
        setErr(null);
        return;
      }
      try {
        setLoading(true);
        setErr(null);
        const { users } = await searchUsers(keyword, { limit: 10, page: 1 });
        if (!cancelled) setItems(users);
      } catch (e: any) {
        if (!cancelled) setErr(e?.response?.data?.message || e?.message || "검색 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [keyword]);

  if (loading) return <div className="w-full text-center py-8">검색 중…</div>;
  if (err) return <div className="w-full text-center py-8 text-red-500">{err}</div>;
  if (items.length === 0) return <div className="w-full text-center py-8">검색 결과가 없어요</div>;

  return (
    <div className="w-full px-4 space-y-2 max-w-[350px] mx-auto">
      {items.map((u) => (
        <SearchUserItem
          key={u.id}
          name={u.name}
          userId={u.userId}
          photo={u.photo}
        />
      ))}
    </div>
  );
};

export default SearchUserList;