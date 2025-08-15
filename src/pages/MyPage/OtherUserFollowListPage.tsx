// src/pages/Others/OtherUserFollowListPage.tsx
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
  date: string;        // 표시용: YYYY-MM-DD -> "6월 21일" 등
  dDay: string;        // 표시용: 기획서상 D-day 자리(없으면 "-")
  buttonType: FollowType;
}

export default function OtherUserFollowListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 초기 탭: location.state?.tab === 'followings' 면 'followings'로 시작
  const initialTab = (location.state as any)?.tab === "followings" ? "followings" : "follower";
  const [tab, setTab] = useState<"follower" | "followings">(initialTab);

  // 검색
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // 아이콘 클릭 시 확정
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSearchSubmit = () => setSearchKeyword(searchTerm);

  // 모달/선택
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 데이터 상태
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // (중요) 내 user_id: 백엔드 스펙 상 body에 필요
  // 프로젝트에서 로그인 시 로컬스토리지에 저장한 키가 다르면 여기만 맞춰 주면 됨.
  const myUserId = localStorage.getItem("userId") || localStorage.getItem("user_id") || "";

  // 날짜 포맷터 (ISO -> "M월 D일")
  function toKRDate(iso: string | null | undefined): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  // 목록을 API 응답(FollowUserItem[])에서 화면용 User[]로 변환
  function mapItemsToUsers(items: FollowUserItem[], from: "followers" | "followings"): User[] {
    return items.map((it) => {
      // 버튼 정책:
      // - followers 탭: 내가 그 사람을 이미 팔로우 중이면 '팔로잉', 아니면 '맞팔로우'
      // - followings 탭: 기본 '팔로잉' (기획 상 '모아참여/모아참여중'은 별도 정책 있을 때 교체)
      let buttonType: FollowType = "팔로잉";
      if (from === "followers") {
        buttonType = it.is_following ? "팔로잉" : "맞팔로우";
      } else {
        buttonType = "팔로잉";
      }

      return {
        id: it.user_id,
        nickname: it.name ?? it.user_id,
        date: toKRDate(it.followed_at) || "",
        dDay: "-", // D-Day는 도메인 정책 확정 시 계산 로직 삽입
        buttonType,
      };
    });
  }

  // 탭 변경/초기 로드 시 데이터 가져오기
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
              setErrorMsg(res.reason ?? "팔로워 목록 로드 실패");
              setUsers([]);
            }
          }
        } else {
          const res = await fetchFollowings(1, 20);
          if (!cancelled) {
            if (res.ok && res.payload) {
              setUsers(mapItemsToUsers(res.payload.followings ?? [], "followings"));
            } else {
              setErrorMsg(res.reason ?? "팔로잉 목록 로드 실패");
              setUsers([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // 검색 필터링
  const filteredUsers = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    const base = kw
      ? users.filter(
          (u) =>
            u.nickname.toLowerCase().includes(kw) ||
            u.id.toLowerCase().includes(kw)
        )
      : users;

    if (tab === "followings") {
      // 기획서 상 followings 탭에선 '팔로잉/모아참여중/모아참여'만 보여주기
      return base.filter((u) =>
        ["팔로잉", "모아참여중", "모아참여"].includes(u.buttonType)
      );
    }
    return base;
  }, [users, searchKeyword, tab]);

  // 언팔로우 버튼 클릭
  const handleUnfollowClick = (id: string) => {
    setSelectedUserId(id);
    setShowUnfollowModal(true);
  };

  // 언팔로우 확인 → (임시) 로컬 상태만 변경
  // TODO: 백엔드에 언팔/팔로우 취소 API 생기면 여기서 호출
  const handleConfirmUnfollow = () => {
    if (selectedUserId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUserId ? { ...u, buttonType: "맞팔로우" } : u))
      );
    }
    setShowUnfollowModal(false);
    setSelectedUserId(null);
  };

  // "맞팔로우" 버튼 클릭 → POST /api/follow/request
  const handleFollowBack = async (targetId: string) => {
    if (!myUserId) {
      alert("로그인 정보가 없어 팔로우할 수 없습니다.");
      return;
    }
    const res = await requestFollow({ user_id: myUserId, target_id: targetId });
    if (res.ok) {
      // 성공 시 UI 업데이트
      setUsers((prev) =>
        prev.map((u) => (u.id === targetId ? { ...u, buttonType: "팔로잉" } : u))
      );
    } else {
      alert(res.reason ?? "팔로우 요청에 실패했습니다.");
    }
  };

  // 버튼 렌더러
  const renderButton = (type: FollowType, id: string) => {
    const base =
      "flex justify-center items-center rounded-[10px] font-pretendard text-[14px] font-bold leading-[22px]";

    switch (type) {
      case "모아참여":
        return (
          <button
            className={`${base} px-[24px] py-[6px] border border-[#6282E1] bg-[#FFF] text-[#6282E1]`}
          >
            모아 참여
          </button>
        );
      case "맞팔로우":
        return (
          <button
            onClick={() => handleFollowBack(id)}
            className={`${base} px-[24px] py-[6px] bg-[#6282E1] !text-[#FFF]`}
          >
            맞팔로우
          </button>
        );
      case "모아참여중":
        return (
          <button
            disabled
            className={`${base} px-[10px] py-[8px] bg-transparent text-[#6282E1] border border-transparent`}
          >
            모아 참여 중
          </button>
        );
      case "팔로잉":
        return (
          <button
            onClick={() => handleUnfollowClick(id)}
            className={`${base} px-[24px] py-[6px] border border-[#C7D5FF] bg-[#FFF] text-[#C7D5FF]`}
          >
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
          <div
            className="bg-[#FFF] rounded-[20px] px-[40px]  flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
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

      {/* 탭 */}
      <div className="relative w-full max-w-[350px] mx-auto">
        <div className="flex justify-between w-full z-10">
          <button onClick={() => setTab("follower")} className="w-1/2 pb-[10px] bg-transparent">
            <span
              className={`block text-center font-pretendard text-[18px] font-semibold ${
                tab === "follower" ? "text-[#6282E1]" : "text-[#C7D5FF]"
              }`}
            >
              팔로워
            </span>
          </button>
          <button onClick={() => setTab("followings")} className="w-1/2 pb-[10px] bg-transparent">
            <span
              className={`block text-center font-pretendard text-[18px] font-semibold ${
                tab === "followings" ? "text-[#6282E1]" : "text-[#C7D5FF]"
              }`}
            >
              팔로잉
            </span>
          </button>
        </div>
        <div className="absolute bottom-[-8px] w-full h-[1px] bg-[#C7D5FF]" />
        <div
          className={`absolute bottom-[-8px] h-[3px] w-1/2 bg-[#6282E1] transition-all duration-300 ${
            tab === "follower" ? "left-0" : "left-1/2"
          }`}
        />
      </div>

      {/* 검색 */}
      <div className="px-[20px] flex justify-center mt-[24px] mb-[24px]">
        <div className="w-[350px] h-[50px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-between pl-[25px] pr-[7px]">
          <input
            type="text"
            placeholder="아이디, 이름을 검색하세요"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-[#1F1F1F] placeholder-[#B7B7B7] font-pretendard text-[16px] font-normal leading-normal outline-none border-none"
          />
          <img
            src={SearchIcon}
            alt="search"
            className="w-[24px] h-[24px] mr-[7px] cursor-pointer"
            onClick={handleSearchSubmit}
          />
        </div>
      </div>

      {/* 목록 */}
      <div className="px-[20px] space-y-[20px]">
        {loading && <div className="text-center text-[#8F8F8F]">불러오는 중…</div>}
        {errorMsg && !loading && <div className="text-center text-[#E25C5C]">{errorMsg}</div>}
        {!loading && !errorMsg && filteredUsers.length === 0 && (
          <div className="text-center text-[#8F8F8F]">결과가 없습니다.</div>
        )}

        {filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-[12px] cursor-pointer"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <img src={ProfileIcon} alt="profile" className="w-[64px] h-[64px] rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold font-pretendard">{user.nickname}</span>
                <span
                  className="text-[16px] font-normal font-pretendard text-[#B7B7B7]"
                  style={{ fontWeight: 600 }}
                >
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
