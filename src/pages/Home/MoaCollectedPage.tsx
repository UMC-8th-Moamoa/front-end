import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import { getMyBirthdayEvent, type MyBirthdayEvent } from "../../services/user/mybirthday";

const MoaCollectedPage = () => {
  const [event, setEvent] = useState<MyBirthdayEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyBirthdayEvent();
        setEvent(res);
        setErr(null);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 404) setErr("진행 중인 생일 이벤트가 없어요.");
        else if (status === 401) setErr("로그인이 필요해요.");
        else setErr("이벤트 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleClick = () => {
    if (!event) return;
    // 선물 고르기 라우팅 규칙에 맞게 eventId 전달
    navigate(`/pick-gift?eventId=${event.eventId}`);
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-b from-[#6282E1] to-[#FEC3FF] w-[393px] min-h-screen mx-auto flex items-center justify-center">
        <p className="text-white">불러오는 중…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="relative bg-gradient-to-b from-[#6282E1] to-[#FEC3FF] w-[393px] min-h-screen mx-auto flex items-center justify-center">
        <p className="text-white">{err}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-[#6282E1] to-[#FEC3FF] w-[393px] min-h-screen mx-auto pb-[100px] overflow-hidden">
      {/* 금액 */}
      <div className="pt-[50px] text-center">
        <p className="text-white text-[40px] font-medium">
          {event!.totalAmount.toLocaleString()}원
        </p>
        <p className="text-white text-[18px] font-medium mt-1">
          의 마음이 모였어요!
        </p>
      </div>

      {/* 참여자 리스트 */}
      <div className="mt-10 px-4">
        <ParticipantList participants={event!.participants} />
      </div>

      {/* 캐릭터 이미지 */}
      <img
        src="/assets/Moa2.png"
        alt="Eclipse"
        className="absolute left-1/3 -translate-x-[20%] w-[481px] h-[481px] object-contain"
      />

      {/* 선물 고르기 버튼 */}
      <div className="w-[350px] absolute bottom-[60px] left-1/2 -translate-x-1/2">
        <Button onClick={handleClick}>
          <p className="text-[20px] text-white text-center">선물 고르기</p>
        </Button>
      </div>
    </div>
  );
};

export default MoaCollectedPage;
