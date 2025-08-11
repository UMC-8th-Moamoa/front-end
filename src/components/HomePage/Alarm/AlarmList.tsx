import { useEffect, useState } from "react";
import AlarmItem from "./AlarmItem";
import { fetchNotifications, type NotificationItem } from "../../../types/notifications";

const toDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

const AlarmList = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await fetchNotifications(1, 10);
        if (data.resultType === "SUCCESS" && data.success) {
          setItems(data.success.notifications);
        } else {
          setErr(data.error ?? "오류가 발생했어요");
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message || e.message || "요청 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="w-full text-center py-8">불러오는 중...</div>;
  if (err) return <div className="w-full text-center py-8 text-red-500">{err}</div>;
  if (items.length === 0) return <div className="w-full text-center py-8">알림이 없어요</div>;

  return (
    <div className="w-full">
      {items.map(n => (
        <AlarmItem key={n.id} date={toDate(n.createdAt)} content={n.message} />
      ))}
    </div>
  );
};

export default AlarmList;
