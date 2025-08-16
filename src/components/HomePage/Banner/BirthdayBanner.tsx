// src/components/HomePage/BirthdayBanner.tsx
import { useEffect, useState } from "react";
import { getMyBirthdayCountdown } from "../../../services/user/friendbirthday";


const BirthdayBanner = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await getMyBirthdayCountdown(); // ✅ 이벤트 불필요
        setName(res.user.name);
        // 오늘 생일이면 0, 아니면 남은 일수
        setDday(res.countdown.isBirthdayToday ? 0 : res.countdown.daysRemaining);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 400) setErr("프로필에 생일 정보를 먼저 등록해 주세요.");
        else if (status === 401) setErr("로그인이 필요해요.");
        else setErr("생일 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="w-[350px] h-[81px] mt-[20px] mx-auto rounded-2xl bg-gray-100 animate-pulse" />
    );
  }
  if (err || dday === null) {
    // 필요하면 안내 배너/CTA로 바꾸세요
    return null;
  }

  return (
    <div className="w-[350px] h-[81px] mt-[20px] mx-auto flex items-center justify-center bg-gradient-to-r from-[#94B2F5] to-[#FFFFFF] rounded-2xl">
      <div className="flex-1 flex items-center justify-center text-4xl font-bold text-white">
        {dday === 0 ? "D-DAY" : `D-${dday}`}
      </div>
      <div className="w-px h-6 bg-white mx-2" />
      <div className="flex-1 flex items-center justify-center text-lg text-[#6282E1]">
        <span className="font-bold">{name}님</span>의 생일
      </div>
    </div>
  );
};

export default BirthdayBanner;
