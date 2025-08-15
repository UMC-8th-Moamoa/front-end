// src/pages/ParticipationPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ClipboardToast from "../../components/HomePage/Participation/ClipboardToast";
import BackButton from "../../components/common/BackButton";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import RecipientBanner from "../../components/HomePage/Participation/RecipientBanner";
import MemberWishList from "../../components/HomePage/Participation/MemberWishList";
import ParticipationActionBox from "../../components/HomePage/Participation/ParticipationActionBox";

// ⚠️ 현재 사용하는 모달 경로/props에 맞춰 import (isOpen 지원)
import ShareModal from "../../components/mypage/ShareModal";

import {
  getRecipientWishlistUi,
  type WishlistUi,
} from "../../services/wishlist/list";

import {
  getBirthdayEventDetail,
  getEventParticipationMeta,
  type EventButtonStatus,
} from "../../services/user/event"; // ← 폴더 확인!

// ParticipantList가 요구하는 최소 형태로 로컬 타입 정의
type SimpleParticipant = {
  id: number;
  name: string;
  photo: string | null;
  participatedAt: string;
};

const ParticipationPage = () => {
  const [search] = useSearchParams();
  const eventIdParam = search.get("eventId");
  const eventId = eventIdParam ? Number(eventIdParam) : undefined;

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 참여자/배너/위시리스트 상태
  const [participants, setParticipants] = useState<SimpleParticipant[]>([]);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhoto, setRecipientPhoto] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [wishlist, setWishlist] = useState<WishlistUi[]>([]);

  // 서버 버튼 상태
  const [buttonStatus, setButtonStatus] = useState<EventButtonStatus | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // eventId 없으면 요청 막기
        if (!eventId || Number.isNaN(eventId)) {
          setErr("잘못된 접근이에요. 공유 링크의 eventId가 필요해요.");
          setParticipants([]);
          setRecipientName("");
          setRecipientPhoto(null);
          setDaysRemaining(0);
          setWishlist([]);
          setButtonStatus(null);
          return;
        }

        // 상세 + 위시리스트 + 참여메타 병렬 조회
        const [detail, wish, meta] = await Promise.all([
          getBirthdayEventDetail(eventId),
          getRecipientWishlistUi(eventId, 1, 10).catch(() => ({
            recipientName: "",
            items: [] as WishlistUi[],
            pagination: { currentPage: 1, totalPages: 0, totalItems: 0 },
          })),
          getEventParticipationMeta(eventId),
        ]);

        if (cancelled) return;

        // 참여자/배너
        setParticipants(
          (detail.participants.list ?? []).map((p) => ({
            id: p.userId,
            name: p.userName,
            photo: p.userPhoto,
            participatedAt: p.participatedAt ?? "",
          }))
        );
        setRecipientName(detail.birthdayPerson.name || wish.recipientName || "");
        setRecipientPhoto(detail.birthdayPerson.photo ?? null);
        setDaysRemaining(detail.countdown?.daysRemaining ?? 0);

        // 위시리스트(참가자용 API 결과 사용)
        setWishlist(wish.items ?? []);

        // 버튼 상태
        setButtonStatus(meta.buttonStatus);
      } catch (e: any) {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 404) setErr("이벤트를 찾을 수 없어요.");
        else if (status === 401) setErr("로그인이 필요해요.");
        else setErr("정보를 불러오지 못했어요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/participation?eventId=${eventId ?? ""}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setIsModalOpen(false); // 복사 후 모달 닫기
    }
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col relative">
        {copied && <ClipboardToast message="클립보드에 복사되었습니다" />}

        <div className="flex items-center space-x-[8px] px-4 pt-5 mb-5">
          <BackButton />
          <p className="text-[18px] font-semibold text-black">
            참여인원 {loading ? "-" : err ? "0" : participants.length}명
          </p>
        </div>

        {/* 참여자 리스트 */}
        <div className="px-4">
          {loading ? (
            <div className="text-sm text-[#97B1FF] py-2">불러오는 중…</div>
          ) : err ? (
            <div className="text-sm text-red-600 py-2">{err}</div>
          ) : (
            <ParticipantList participants={participants} />
          )}
        </div>

        <div className="w-[350px] h-px bg-[#D3D3D3] mx-auto mt-1 mb-5" />

        {/* 수신자/디데이 배너 */}
        <div className="px-4">
          <RecipientBanner
            name={recipientName}
            photo={recipientPhoto ?? undefined}
            daysRemaining={daysRemaining}
          />
        </div>

        {/* 위시리스트 */}
        <div className="px-4">
          <MemberWishList
            isMyPage={false}
            recipientName={recipientName || "친구"}
            items={wishlist}
            eventId={eventId}
          />
        </div>

        {/* 하단 액션/공유 */}
        <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2 w-full max-w-[393px] px-4 z-50">
          {!err && buttonStatus && (
            <ParticipationActionBox
              isMyPage={false}
              buttonStatus={buttonStatus}
              onPrimaryClick={() => {}}
              onShareClick={() => setIsModalOpen(true)}
              // actionRoutes={{ participate: "/select-remittance", writeLetter: "/moaletter/write", editLetter: "/moaletter/edit" }}
            />
          )}
        </div>

        {/* ✅ isOpen prop 있는 버전이라 조건부 렌더링로 제어 */}
        {isModalOpen && (
          <ShareModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCopy={handleCopy}
            eventId={eventId}
          />
        )}
      </div>
    </main>
  );
};

export default ParticipationPage;
