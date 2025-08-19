// src/pages/MyPage/OtherUserProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BackButton from "../../components/common/BackButton";
import ProfileImg from "../../assets/profile.svg";
import RightArrow from "../../assets/Right_gray.svg";
import ParticipationIcon from "../../assets/Participation.svg";
import HeartIcon from "../../assets/Heart.svg";
import GiftIcon from "../../assets/Gift.svg";
import ShareIcon from "../../assets/Share.svg";
import Gmail from "../../assets/Gmail_logo.svg";
import Kakao from "../../assets/Kakaotalk_logo.svg";
import Discord from "../../assets/Discord_logo.svg";
import Instagram from "../../assets/Instagram_logo.svg";
import XLogo from "../../assets/X_logo.svg";
import Copy from "../../assets/Copy.svg";
import WishImage from "../../assets/Wishitem.svg";

import { requestFollow } from "../../services/follow";
import {
  fetchOtherUserProfile,
  type OtherUserProfile,
} from "../../services/profile";

/** YYYY-MM-DD -> YYYY.MM.DD */
function fmtBirthday(iso?: string | null) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

function OtherUserProfilePage() {
  const { id } = useParams(); // 라우트 파라미터(/user/:id)
  const navigate = useNavigate();

  // 내 아이디(문자/숫자 모두 허용). 백엔드 요구에 맞춰 사용
  const myUserId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    "";

  // 모달/상태
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showRemoveFollowerModal, setShowRemoveFollowerModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showFollowConfirmModal, setShowFollowConfirmModal] = useState(false);

  // 데이터 상태
  const [profile, setProfile] = useState<OtherUserProfile | null>(null);
  const [wishlistPreview, setWishlistPreview] = useState<
    Array<{ id: number; title: string; imageUrl: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 파생 상태: 현재 팔로잉 여부(UI용)
  const isFollowing = profile?.isFollowing ?? false;

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!id) return;
      setLoading(true);
      setErr(null);

      try {
        // 1) 프로필
        const prof = await fetchOtherUserProfile(id);
      

        if (!mounted) return;

        if (!prof) {
          setErr("존재하지 않는 사용자입니다.");
          setProfile(null);
          setWishlistPreview([]);
          setLoading(false);
          return;
        }

        setProfile(prof);
      } catch (e: any) {
        if (!mounted) return;
        setErr("프로필을 불러오지 못했습니다.");
        setProfile(null);
        setWishlistPreview([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  // 내 프로필로 들어오면 마이페이지로 보낼지 여부(선택)
  useEffect(() => {
    if (!id || !myUserId) return;
    if (String(id) === String(myUserId)) {
      // 필요 시 내 페이지로 리다이렉트
      // navigate("/mypage");
    }
  }, [id, myUserId, navigate]);

  // 상단에 보여줄 표기값
  const headerName = useMemo(() => {
    if (!profile) return "";
    // 디자인에 맞춰 name 또는 userId 노출
    return profile.userId || profile.name || "";
  }, [profile]);

  // --- 팔로우/언팔 핸들러 ---
  const openFollowModal = () => setShowFollowConfirmModal(true);
  const cancelFollow = () => setShowFollowConfirmModal(false);

  const confirmFollow = async () => {
    if (!myUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!id) return;

    const res = await requestFollow({ user_id: myUserId, target_id: id });
    if (res.ok) {
      // 성공 시 로컬 상태 갱신
setProfile(p => p ? {
  ...p,
  isFollowing: true,
  followersCount: p.followersCount + 1 // 임시 증가
} : p);

    } else {
      alert(res.reason ?? "팔로우 요청에 실패했습니다.");
    }
    setShowFollowConfirmModal(false);
  };

  const onClickUnfollow = () => setShowUnfollowModal(true);

  const onConfirmUnfollow = () => {
    // 현재 API 없음 → 안내만
    alert("언팔로우 API가 아직 준비되지 않았습니다.");
    setShowUnfollowModal(false);
  };

  // 로딩/에러 처리
  if (loading) {
    return (
      <div className="max-w-[393px] mx-auto bg-white min-h-screen text-black flex items-center justify-center">
        <span className="text-[16px] text-[#1F1F1F]">불러오는 중…</span>
      </div>
    );
  }

  if (err || !profile) {
    return (
      <div className="max-w-[393px] mx-auto bg-white min-h-screen text-black flex items-center justify-center">
        <span className="text-[16px] text-[#B00020]">{err ?? "에러가 발생했습니다."}</span>
      </div>
    );
  }

  return (
    <>
      {/* 팔로워 삭제 모달: 아직 API가 없으므로 UI만 표시 */}
      {showRemoveFollowerModal && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
          onClick={() => setShowRemoveFollowerModal(false)}
        >
          <div
            className="bg-[#FFF] rounded-[20px] flex flex-col items-center w-[350px] ml-[-15px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-[17px] mb-[20px] mt-[31px]">
              팔로워를 삭제하시겠습니까?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRemoveFollowerModal(false)}
                className="flex justify-center mb-[31px] items-center mr-[12px] h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-pretendard font-medium"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert("팔로워 삭제 API가 아직 준비되지 않았습니다.");
                  setShowRemoveFollowerModal(false);
                }}
                className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[18px] font-pretendard font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 언팔로우 모달 */}
      {showUnfollowModal && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
          onClick={() => setShowUnfollowModal(false)}
        >
          <div
            className="bg-[#FFF] rounded-[20px] flex flex-col items-center w-[350px] ml-[-15px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-[17px] mb-[20px] mt-[31px] ">
              팔로우를 취소하시겠습니까?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUnfollowModal(false)}
                className="flex justify-center mb-[31px] items-center mr-[12px] h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-pretendard font-medium"
              >
                취소
              </button>
              <button
                onClick={onConfirmUnfollow}
                className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-white text-[18px] font-pretendard font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 팔로우 확인 모달 */}
      {showFollowConfirmModal && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
          onClick={cancelFollow}
        >
          <div
            className="bg-[#FFF] rounded-[20px] flex flex-col items-center w-[350px] ml-[-15px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-[17px] mb-[20px] mt-[31px] ">
              이 사용자를 팔로우하시겠습니까?
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelFollow}
                className="flex justify-center mb-[31px] items-center mr-[12px] h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-pretendard font-medium"
              >
                아니오
              </button>
              <button
                onClick={confirmFollow}
                className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-white text-[18px] font-pretendard font-medium"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      {isShareModalOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col justify-end">
          {/* 어두운 배경 */}
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.25)]"
            onClick={() => setIsShareModalOpen(false)}
          />

          {/* 하단 시트 */}
          <div className="relative w-[390px] h-[267px] bg-[#FFF] rounded-t-[40px] mx-auto px-[24px] pt-[12px] pb-[24px]">
            {/* 회색 바 */}
            <div className="w-[74px] h-[6px] rounded-full bg-[#B7B7B7] mx-auto mb-[30px]" />

            {/* 아이콘 리스트 */}
            <div className="flex gap-[20px] overflow-x-auto scrollbar-hide mb-[21px]">
              {[
                { icon: Gmail, label: "Gmail" },
                { icon: Kakao, label: "카카오톡" },
                { icon: Discord, label: "Discord" },
                { icon: Instagram, label: "Instagram" },
                { icon: XLogo, label: "X" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center min-w-[60px]">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[54px] h-[54px] rounded-full mb-[6px]"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <span className="text-[13px] text-[#1F1F1F] font-pretendard">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 구분선 */}
            <div className="w-full h-[1px] bg-[#E1E1E1] mb-[25px]" />

            {/* 링크 복사 */}
            <div
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => alert("링크가 복사되었습니다."))
                  .catch(() => alert("복사에 실패했습니다."));
              }}
              className="flex items-center gap-[8px] cursor-pointer"
            >
              <img src={Copy} alt="링크 복사" className="w-[54px] h-[54px]" />
              <span className="text-[#6282E1] text-[18px] font-medium font-pretendard" style={{ fontWeight: 500 }}>
                링크 복사
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 본문 */}
      <div className="max-w-[393px] mx-auto bg-white min-h-screen text-black">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-4">
          {/* 왼쪽: BackButton + 이름 */}
          <div className="flex items-center">
            <BackButton />
            <span className="ml-[12px] text-[20px] font-bold" style={{ fontWeight: 700 }}>
              {profile.name || headerName}
            </span>
          </div>

          {/* 오른쪽: Share 아이콘 */}
          <img
            src={ShareIcon}
            alt="공유"
            onClick={() => setIsShareModalOpen(true)}
            className="cursor-pointer"
          />
        </div>

        {/* 프로필 영역 */}
        <div className="px-[20px] py-[12px]">
          <div className="flex items-start gap-[12px]">
            <div className="flex flex-col items-center gap-[8px]">
              {/* 프로필 사진 */}
              <img
                src={profile.photo || ProfileImg}
                alt="프로필 이미지"
                className="w-[68px] h-[68px] rounded-full object-cover bg-[#B6B6B6]"
              />
            </div>

            {/* 우측 정보블록 */}
            <div className="flex-1 mt-[10px] ml-[16px]">
              {/* userId + 생일 한 줄 */}
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-semibold text-[#1F1F1F] font-pretendard" style={{ fontWeight: 500 }}>
                  {profile.userId}
                </span>
                <span className="text-[16px] text-[#B7B7B7] font-pretendard">
                  {fmtBirthday(profile.birthday)}
                </span>
              </div>

              {/* 팔로워/팔로잉 */}
              <div className="flex gap-[20px] mt-[8px]">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[18px] text-[#B7B7B7] font-pretendard">팔로워</span>
                  <span className="text-[20px] text-[#1F1F1F] font-pretendard" style={{ fontWeight: 500 }}>
                    {profile.followersCount}
                  </span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="text-[18px] text-[#B7B7B7] font-pretendard">팔로잉</span>
                  <span className="text-[20px] text-[#1F1F1F] font-pretendard" style={{ fontWeight: 500 }}>
                    {profile.followingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex mt-[16px]">
            {/* 케이스:
                1) 상대가 나를 팔로우(isFollower)했지만 나는 아직 아님(!isFollowing) → '팔로워 삭제' + '맞팔로우'
                2) 내가 팔로잉 중(isFollowing) → '팔로우 취소하기'
                3) 그 외 → '팔로우'
              */}
            {profile.isFollower && !isFollowing ? (
              <div className="flex gap-[10px]">
                <button
                  onClick={() => setShowRemoveFollowerModal(true)}
                  className="flex justify-center items-center w-[168px] h-[35px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[16px] font-semibold font-pretendard"
                  style={{ fontWeight: 600 }}
                >
                  팔로워 삭제
                </button>
                <button
                  onClick={openFollowModal}
                  className="flex justify-center items-center w-[168px] h-[35px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[16px] font-semibold font-pretendard"
                  style={{ fontWeight: 600 }}
                >
                  맞팔로우
                </button>
              </div>
            ) : isFollowing ? (
              <button
                onClick={onClickUnfollow}
                className="flex justify-center items-center w-[350px] h-[35px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] font-pretendard"
                style={{ fontWeight: 600 }}
              >
                팔로우 취소하기
              </button>
            ) : (
              <button
                onClick={openFollowModal}
                className="flex justify-center items-center w-[350px] h-[35px] rounded-[10px] bg-[#6282E1] text-[#FFF] font-pretendard"
                style={{ fontWeight: 600 }}
              >
                팔로우
              </button>
            )}
          </div>

          {/* 구분선 */}
          <div className="w-[350px] h-[1px] bg-[#E1E1E1] mt-[16px] mx-auto" />
        </div>

        {/* 위시리스트 섹션 */}
        <div className="px-[20px]">
          <div className="flex justify-between items-center mb-[12px]">
            <span className="text-[#6282E1] text-[18px] font-bold leading-[22px] font-pretendard" style={{ fontWeight: 700 }}>
              위시리스트
            </span>

            <div className="flex items-center gap-[2px] cursor-pointer" onClick={() => navigate(`/user/${id}/wishlist`)}>
              <span className="text-[#B7B7B7] text-[12px] font-medium font-pretendard">더보기</span>
              <img src={RightArrow} alt="더보기 화살표" className="w-[16px] h-[16px]" />
            </div>
          </div>

          {/* 가로 스크롤 카드 */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-[8px] flex-nowrap w-max">
              {(wishlistPreview.length ? wishlistPreview : Array.from({ length: 3 }).map((_, i) => ({
                id: i, title: "아이템", imageUrl: null,
              }))).map((item) => (
                <div key={item.id} className="flex flex-col shrink-0 w-[119px]">
                  <div
                    className="w-[119px] h-[119px] rounded-[16px] bg-[#E1E1E1] mb-[6px]"
                    style={{
                      backgroundImage: `url(${item.imageUrl || WishImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="text-[#1F1F1F] text-[12px] font-normal font-pretendard leading-normal">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherUserProfilePage;
