// src/pages/Others/OtherUserWishlistPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import Perfume from "../../assets/Perfume.svg";
import { fetchOtherPageInfo } from "../../services/follow";

type WishItem = { id: number; name: string; price: string };

export default function OtherUserWishlistPage() {
  // 라우팅: /user/:userId/wishlist 형태라면 useParams 사용
  const { userId: routeUserId } = useParams<{ userId: string }>();
  // 혹은 링크에서 state로 전달되었다면 fallback
  const location = useLocation();
  const stateUserId = (location.state as any)?.userId as string | undefined;
  const stateUserName = (location.state as any)?.userName as string | undefined;

  const userId = routeUserId || stateUserId || ""; // 상대방 user_id
  const [titleName, setTitleName] = useState(stateUserName ?? "사용자");

  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 임시 더미(실제에선 wishlist API 연결 예정)
  const wishlist: WishItem[] = [
    { id: 1, name: "딥디크 필로시코스 오드 뚜왈렛", price: "100,000원" },
    { id: 2, name: "딥디크 필로시코스 오드 뚜왈렛", price: "100,000원" },
    { id: 3, name: "딥디크 필로시코스 오드 뚜왈렛", price: "100,000원" },
    { id: 4, name: "딥디크 필로시코스 오드 뚜왈렛", price: "100,000원" },
  ];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!userId) {
        setErrorMsg("잘못된 접근입니다.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorMsg(null);
      const res = await fetchOtherPageInfo(userId);
      if (!cancelled) {
        if (res.ok && res.payload?.OtherInfo) {
          const other = res.payload.OtherInfo;
          setIsFollowing(Boolean(other.is_following)); // 내가 그 사람을 팔로우하면 볼 수 있게
          if (other.name) setTitleName(other.name);
        } else {
          setErrorMsg(res.reason ?? "상대 사용자 정보를 불러오지 못했습니다.");
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="relative max-w-[393px] mx-auto min-h-screen bg-white text-black">
      {/* 고정 상단바 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[393px] z-[1000] bg-white px-[20px] pb-[16px]">
        <div className="flex items-center gap-[60px]">
          <BackButton />
          <h1 className="text-[18px] font-bold font-pretendard">{titleName}님의 위시리스트</h1>
        </div>
      </div>

      {/* 상단바 높이만큼 패딩 */}
      <div className="pt-[40px] px-[20px] pb-[40px]"></div>

      {loading && <div className="text-center text-[#8F8F8F]">불러오는 중…</div>}
      {errorMsg && !loading && <div className="text-center text-[#E25C5C]">{errorMsg}</div>}

      {!loading && !errorMsg && (
        <>
          {isFollowing ? (
            <div className="flex flex-col gap-[14px]">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-[10px] w-[350px] h-[121px] bg-white border border-[#E1E1E1] rounded-[14px] px-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                >
                  <img
                    src={Perfume}
                    alt={item.name}
                    className="w-[105px] h-[105px] rounded-[10px] object-cover bg-[#D9D9D9]"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-[14px] py-[12px] mb-[28px] font-medium text-[#1F1F1F]">
                      {item.name}
                    </span>
                    <span className="text-[20px] font-bold text-[#1F1F1F] mt-[6px]" style={{ fontWeight: 600 }}>
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-[60px] text-[#8F8F8F] text-[15px] font-medium">
              이 사용자의 위시리스트는 팔로우 후에 볼 수 있어요.
            </div>
          )}
        </>
      )}
    </div>
  );
}
