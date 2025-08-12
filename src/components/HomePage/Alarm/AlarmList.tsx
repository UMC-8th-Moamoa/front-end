// src/components/Alarm/AlarmList.tsx
import { useEffect, useRef, useState } from "react";
import AlarmItem from "./AlarmItem";
import { fetchNotifications, type NotificationItem, type Pagination } from "../../../services/notifications";


const toDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

const AlarmList = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [pageInfo, setPageInfo] = useState<Partial<Pagination>>({});
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const { items: list, pagination, hasUnread } = await fetchNotifications(1, 10); // ✅ 이름 변경
        if (!mounted.current) return;
        setItems(list);
        setPageInfo(pagination);
        setHasUnread(hasUnread);
        console.log("[알림]", { count: list.length, pagination, hasUnread });
      } catch (e: any) {
        if (!mounted.current) return;
        setErr(e?.response?.data?.message || e?.message || "요청 실패");
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => { mounted.current = false; };
  }, []);

  if (loading) return <div className="w-full text-center py-8">불러오는 중...</div>;
  if (err) return <div className="w-full text-center py-8 text-red-500">{err}</div>;
  if (items.length === 0) return <div className="w-full text-center py-8">알림이 없어요</div>;

  return (
    <div className="w-full">
      <div className="px-4 py-2 text-xs text-gray-500">
        page {pageInfo.page ?? 1}/{pageInfo.totalPages ?? 0} · total {pageInfo.totalElements ?? 0} ·
        {hasUnread ? " 🔔 미읽음 있음" : " 모두 읽음"}
      </div>

      {items.map((n) => (
        <AlarmItem key={n.id} date={toDate(n.createdAt)} content={n.message} />
      ))}
    </div>
  );
};

export default AlarmList;
