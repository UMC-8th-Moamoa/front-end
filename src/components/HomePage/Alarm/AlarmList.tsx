import { useEffect, useRef, useState } from "react";
import AlarmItem from "./AlarmItem";
import {
  fetchNotifications,
  getUnreadStatus,
  markAllNotificationsRead,
  type NotificationItem,
  type Pagination,
} from "./AlarmDummy";

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

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      // ✅ 더미에서 읽어오기
      const [{ items: list, pagination }, unread] = await Promise.all([
        fetchNotifications(1, 10),
        getUnreadStatus(),
      ]);
      if (!mounted.current) return;
      setItems(list);
      setPageInfo(pagination);
      setHasUnread(unread);
    } catch (e: any) {
      if (!mounted.current) return;
      setErr(e?.message || "요청 실패");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="w-full text-center py-8">불러오는 중...</div>;
  if (err) return <div className="w-full text-center py-8 text-red-500">{err}</div>;
  if (items.length === 0)
    return (
      <div className="w-full text-center py-8">
        알림이 없어요
        {hasUnread ? " (미읽음 표시 오류?)" : ""}
      </div>
    );

  return (
    <div className="w-full">
      <div className="px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
      </div>

      {items.map((n) => (
        <AlarmItem key={n.id} date={toDate(n.createdAt)} content={n.message} />
      ))}
    </div>
  );
};

export default AlarmList;
