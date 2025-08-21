// src/pages/ParticipationPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import ClipboardToast from "../../components/HomePage/Participation/ClipboardToast";
import BackButton from "../../components/common/BackButton";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import RecipientBanner from "../../components/HomePage/Participation/RecipientBanner";
import MemberWishList from "../../components/HomePage/Participation/MemberWishList";
import ParticipationActionBox from "../../components/HomePage/Participation/ParticipationActionBox";

import {
  getBirthdayEventDetail,
  getEventParticipationMeta,
  mapRecipientWishlistUiFromDetail,
  type EventButtonStatus,
  type WishlistUi,
  type ParticipationScreenDTO,
} from "../../services/user/event"; // ✅ 경로 통일
import ShareModal from "../../components/HomePage/Participation/ShareModal";

type SimpleParticipant = {
  id: number;
  name: string;
  photo: string | null;
  participatedAt: string;
};

const ParticipationPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const raw = (search.get("eventId") ?? "").trim();
  const eventId = /^\d+$/.test(raw) ? Number(raw) : undefined;

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [participants, setParticipants] = useState<SimpleParticipant[]>([]);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhoto, setRecipientPhoto] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [wishlist, setWishlist] = useState<WishlistUi[]>([]);
  const [buttonStatus, setButtonStatus] = useState<EventButtonStatus | null>(null);
  const [meta, setMeta] = useState<ParticipationScreenDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!eventId) {
          setErr("잘못된 접근이에요. 공유 링크의 eventId가 필요해요.");
          setParticipants([]);
          setRecipientName("");
          setRecipientPhoto(null);
          setDaysRemaining(0);
          setWishlist([]);
          setButtonStatus(null);
          return;
        }

        const [detail, metaRes] = await Promise.all([
          getBirthdayEventDetail(eventId),
          getEventParticipationMeta(eventId),
        ]);
        if (cancelled) return;

        setParticipants(
          (detail.participants.list ?? []).map((p) => ({
            id: p.userId,
            name: p.userName,
            photo: p.userPhoto,
            participatedAt: p.participatedAt ?? "",
          }))
        );
        setRecipientName(detail.birthdayPerson.name || "");
        setRecipientPhoto(detail.birthdayPerson.photo ?? null);
        setDaysRemaining(detail.countdown?.daysRemaining ?? 0);

        const wish = mapRecipientWishlistUiFromDetail(detail, 1, 10);
        setWishlist(wish.items ?? []);

        setButtonStatus(metaRes.buttonStatus);
        setMeta(metaRes);
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
      setIsModalOpen(false);
    }
  };

  // ✅ buttonAction에 따라 라우팅 분기
  const handlePrimaryByAction = () => {
    if (!eventId || !buttonStatus) return;
    const action = buttonStatus.buttonAction;

    if (action === "PARTICIPATE") {
      navigate(`/select-remittance?eventId=${eventId}`);
    } else if (action === "WRITE_LETTER") {
      navigate(`/moaletter/write?eventId=${eventId}`);
    } else if (action === "EDIT_LETTER") {
      // 편지 id를 내려주지 않는다면 eventId 기반 edit 진입(페이지에서 eventId로 조회)
      navigate(`/moaletter/edit?eventId=${eventId}`);
    } else {
      // 알 수 없는 액션은 참여 플로우로 폴백
      navigate(`/select-remittance?eventId=${eventId}`);
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
            <div className="text-sm text-[#97B1FF]">불러오는 중…</div>
          ) : err ? (
            <div className="text-sm text-red-600">{err}</div>
          ) : (
            <ParticipantList participants={participants} />
          )}
        </div>

        <div className="w-[345px] h-px bg-[#D3D3D3] mx-auto mb-5" />

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
              onPrimaryClick={handlePrimaryByAction}   // ✅ 액션 분기 적용
              onShareClick={() => setIsModalOpen(true)}
            />
          )}
        </div>

        {/* 공유 모달 */}
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
