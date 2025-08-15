// src/pages/ParticipationPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import MemberWishList from "../../components/HomePage/Participation/MemberWishList";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import ParticipationActionBox from "../../components/HomePage/Participation/ParticipationActionBox";
import RecipientBanner from "../../components/HomePage/Participation/RecipientBanner";
import ShareModal from "../../components/HomePage/Participation/ShareModal";
import ClipboardToast from "../../components/HomePage/Participation/ClipboardToast";

// 내 이벤트(Fallback)
import {
  getMyBirthdayEvent,
  type MyBirthdayEventParticipant,
} from "../../services/user/mybirthday";


// ✅ 참가자용 위시리스트 조회 API
import {
  getRecipientWishlistUi,
  type WishlistUi,
} from "../../services/wishlist/list";
import { getBirthdayEventDetail } from "../../services/user/event";

const ParticipationPage = () => {
  const [search] = useSearchParams();
  const eventIdParam = search.get("eventId");
  const eventId = eventIdParam ? Number(eventIdParam) : undefined;

  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 참여자/배너/위시리스트 상태
  const [participants, setParticipants] = useState<MyBirthdayEventParticipant[]>([]);
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhoto, setRecipientPhoto] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [wishlist, setWishlist] = useState<WishlistUi[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (eventId && !Number.isNaN(eventId)) {
          // ✅ 상세 + 위시리스트 병렬 조회
          const [detail, wish] = await Promise.all([
            getBirthdayEventDetail(eventId),
            getRecipientWishlistUi(eventId, 1, 10).catch(() => ({
              recipientName: "",
              items: [] as WishlistUi[],
              pagination: { currentPage: 1, totalPages: 0, totalItems: 0 },
            })),
          ]);

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
        } else {
          // ⚠️ eventId가 없으면 "내 생일 이벤트"로 Fallback
          const me = await getMyBirthdayEvent();
          setParticipants(me.participants ?? []);
          setRecipientName("내 생일");
          setRecipientPhoto(null);
          setDaysRemaining(me.daysRemaining ?? 0);
          setWishlist([]); // 내 이벤트 요약엔 위시리스트가 없음
        }
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 404) setErr("진행 중인 이벤트가 없어요.");
        else if (status === 401) setErr("로그인이 필요해요.");
        else setErr("정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
          <ParticipationActionBox
            isMyPage={false}
            participationStatus="none"
            onClick={() => {}}
            onShareClick={() => setIsModalOpen(true)}
          />
        </div>

        <ShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCopy={handleCopy}
          eventId={eventId} // 필요 시 그대로 전달
        />
      </div>
    </main>
  );
};

export default ParticipationPage;
