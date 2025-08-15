// src/pages/MyPage/OtherUserFollowListPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProfileIcon from "../../assets/profile.svg";
import SearchIcon from "../../assets/Search.svg";
import BackButton from "../../components/common/BackButton";
import {
  fetchFollowers,
  fetchFollowings,
  requestFollow,
  type FollowUserItem,
} from "../../services/follow";

type FollowType = "모아참여" | "맞팔로우" | "모아참여중" | "팔로잉";

interface User {
  id: string;          // user_id
  nickname: string;    // name or user_id
  date: string;        // YYYY-MM-DD → "6월 21일"
  dDay: string;        // 기획서상 자리(데이터 없으면 "-")
  buttonType: FollowType;
}

export default function OtherUserFollowListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 기본 탭: state.tab === 'followings'면 팔로잉, 아니면 팔로워
  const initialTab = location.state?.tab === "followings" ? "followings" : "follower";
  const [tab, setTab] = useState<"follower" | "followings">(initialTab);

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSearchSubmit = () => setSearchKeyword(searchTerm);

  // 목록/상태
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 로그인 사용자 ID (로컬 저장된 값 사용)
  const myUserId = localStorage.getItem("userId") || localStorage.getItem("user_id") || "";

  // YYYY-MM-DD 같은 날짜 문자열 → "6월 21일"
  const toKRDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 서버 응답 → 화면용 User로 매핑
  const mapItemsToUsers = (items: FollowUserItem[], from: "followers" | "followings"): User[] =>
    items.map((it) => {
      let buttonType: FollowType = "팔로잉";
      if (from === "followers") buttonType = it.is_following ? "팔로잉" : "맞팔로우";
      return {
        id: it.user_id,
        nickname: it.name ?? it.user_id,
        date: toKRDate(it.followed_at),
        dDay: "-",
        buttonType,
      };
    });

  // 탭 변경 시 목록 로드
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        if (tab === "follower") {
          const res = await fetchFollowers(1, 20);
          if (!cancelled) {
            if (res.ok && res.payload) {
              setUsers(mapItemsToUsers(res.payload.followers ?? [], "followers"));
            } else {
              setUsers([]);
              setErrorMsg(res.reason ?? "팔로워 목록 로드 실패");
            }
          }
        } else {
          const res = await fetchFollowings(1, 20);
          if (!cancelled) {
            if (res.ok && res.payload) {
              setUsers(mapItemsToUsers(res.payload.followings ?? [], "followings"));
            } else {
              setUsers([]);
              setErrorMsg(res.reason ?? "팔로잉 목록 로드 실패");
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  // 검색 + 탭 필터
  const filteredUsers = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    const base = kw
      ? users.filter(
          (u) =>
            u.nickname.toLowerCase().includes(kw) ||
            u.id.toLowerCase().includes(kw)
        )
      : users;

    // followings 탭: '팔로잉/모아참여중/모아참여'만 표시
    if (tab === "followings") {
      return base.filter((u) =>
        ["팔로잉", "모아참여중", "모아참여"].includes(u.buttonType)
      );
    }
    return base;
  }, [users, searchKeyword, tab]);

  // 언팔 모달 오픈
  const handleUnfollowClick = (id: string) => {
    setSelectedUserId(id);
    setShowUnfollowModal(true);
  };

  // (명세에 언팔 API 없음) UI만 변경
  const handleConfirmUnfollow = () => {
    if (selectedUserId) {
      setUsers((prev) => prev.map((u) => (u.id === selectedUserId ? { ...u, buttonType: "맞팔로우" } : u)));
    }
    setShowUnfollowModal(false);
    setSelectedUserId(null);
  };

  // 맞팔로우 → POST /api/follow/request
  const handleFollowBack = async (targetId: string) => {
    if (!myUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const res = await requestFollow({ user_id: myUserId, target_id: targetId });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === targetId ? { ...u, buttonType: "팔로잉" } : u)));
    } else {
      alert(res.reason ?? "팔로우 요청 실패");
    }
  };

  // 버튼 렌더러
  const renderButton = (type: FollowType, id: string) => {
    const base = "flex justify-center items-center rounded-[10px] font-pretendard text-[14px] font-bold leading-[22px]";
    switch (type) {
      case "모아참여":
        return (
          <button className={`${base} px-[24px] py-[6px] border border-[#6282E1] bg-[#FFF] text-[#6282E1]`}>
            모아 참여
          </button>
        );
      case "맞팔로우":
        return (
          <button onClick={() => handleFollowBack(id)} className={`${base} px-[24px] py-[6px] bg-[#6282E1] !text-[#FFF]`}>
            맞팔로우
          </button>
        );
      case "모아참여중":
        return (
          <button disabled className={`${base} px-[10px] py-[8px] bg-transparent text-[#6282E1] border border-transparent`}>
            모아 참여 중
          </button>
        );
      case "팔로잉":
        return (
          <button onClick={() => handleUnfollowClick(id)} className={`${base} px-[24px] py-[6px] border border-[#C7D5FF] bg-[#FFF] text-[#C7D5FF]`}>
            팔로잉
          </button>
        );
    }
  };

  return (
    <div className="max-w-[393px] mx-auto min-h-screen bg-[#FFF] text-black">
      {/* 언팔로우 모달 */}
      {showUnfollowModal && (
        <div
          className="w-[393px] h-[844px] fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
          onClick={() => setShowUnfollowModal(false)}
        >
          <div className="bg-[#FFF] rounded-[20px] px-[40px] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <p className="font-semibold text-[17px] mb-[20px] mt-[31px]">팔로우를 취소하시겠습니까?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUnfollowModal(false)}
                className="flex justify-center mb-[31px] items-center mr-[12px] h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-[#FFF] text-[#6282E1] text-[18px] font-pretendard font-medium"
              >
                취소
              </button>
              <button
                onClick={handleConfirmUnfollow}
                className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[18px] font-pretendard font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상단 바 */}
      <div className="px-[20px] flex items-center justify-between pb-4">
        <BackButton />
        <div className="w-6 h-6" />
      </div>

      {/* 탭 메뉴 */}
      <div className="relative w-full max-w-[350px] mx-auto">
        <div className="flex justify-between w-full z-10">
          <button onClick={() => setTab("follower")} className="w-1/2 pb-[10px] bg-transparent">
            <span className={`block text-center font-pretendard text-[18px] font-semibold ${tab === "follower" ? "text-[#6282E1]" : "text-[#C7D5FF]"}`}>팔로워</span>
          </button>
        <button onClick={() => setTab("followings")} className="w-1/2 pb-[10px] bg-transparent">
            <span className={`block text-center font-pretendard text-[18px] font-semibold ${tab === "followings" ? "text-[#6282E1]" : "text-[#C7D5FF]"}`}>팔로잉</span>
          </button>
        </div>
        <div className="absolute bottom-[-8px] w-full h-[1px] bg-[#C7D5FF]" />
        <div className={`absolute bottom-[-8px] h-[3px] w-1/2 bg-[#6282E1] transition-all duration-300 ${tab === "follower" ? "left-0" : "left-1/2"}`} />
      </div>

      {/* 검색창 (한 번만 렌더링) */}
      <div className="px-[20px] flex justify-center mt-[24px] mb-[24px]">
        <div className="w-[350px] h-[50px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-between pl-[25px] pr-[7px]">
          <input
            type="text"
            placeholder="아이디, 이름을 검색하세요"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-[#1F1F1F] placeholder-[#B7B7B7] font-pretendard text-[16px] font-normal leading-normal outline-none border-none"
          />
          <img src={SearchIcon} alt="search" className="w-[24px] h-[24px] mr-[7px] cursor-pointer" onClick={handleSearchSubmit} />
        </div>
      </div>

      {/* 목록 */}
      <div className="px-[20px] space-y-[20px]">
        {loading && <div className="text-center text-[#8F8F8F]">불러오는 중…</div>}
        {errorMsg && !loading && <div className="text-center text-[#E25C5C]">{errorMsg}</div>}
        {!loading && !errorMsg && filteredUsers.length === 0 && <div className="text-center text-[#8F8F8F]">결과가 없습니다.</div>}

        {filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
              <img src={ProfileIcon} alt="profile" className="w-[64px] h-[64px] rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold font-pretendard">{user.nickname}</span>
                <span className="text-[16px] font-normal font-pretendard text-[#B7B7B7]" style={{ fontWeight: 600 }}>
                  {user.date}{" "}
                  <span className="text-[#E25C5C] text-[18px] font-semibold" style={{ fontWeight: 400 }}>
                    ({user.dDay})
                  </span>
                </span>
              </div>
            </div>
            {renderButton(user.buttonType, user.id)}
          </div>
        ))}
      </div>
    </div>
  );
}
