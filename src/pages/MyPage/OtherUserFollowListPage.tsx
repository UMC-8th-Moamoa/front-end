import { useNavigate, useLocation  } from 'react-router-dom';
import { useState } from 'react';
import ProfileIcon from '../../assets/profile.svg';
import SearchIcon from '../../assets/Search.svg';
import BackButton from '../../components/common/BackButton';

type FollowType = '모아참여' | '맞팔로우' | '모아참여중' | '팔로잉';

interface User {
  id: string;
  nickname: string;
  date: string;
  dDay: string;
  buttonType: FollowType;
}

export default function OtherUserFollowListPage() {
  const navigate = useNavigate();
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [searchKeyword, setSearchKeyword] = useState(''); // 아이콘 클릭 시 적용될 실제 검색어

  const location = useLocation();
  const initialTab = location.state?.tab === 'following' ? 'following' : 'follower';
  const [tab, setTab] = useState<'follower' | 'following'>(initialTab);

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};
const handleSearchSubmit = () => {
  setSearchKeyword(searchTerm); // 실제 검색어 적용
};

  const [users, setUsers] = useState<User[]>([
    { id: '1', nickname: '골드', date: '6월 21일', dDay: 'D-7', buttonType: '모아참여' },
    { id: '2', nickname: '구혜준', date: '6월 21일', dDay: 'D-7', buttonType: '맞팔로우' },
    { id: '3', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '모아참여중' },
    { id: '4', nickname: '박서진', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
    { id: '5', nickname: '조민지', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
    { id: '6', nickname: '냥냥이', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
  ]);

const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.nickname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.id.toLowerCase().includes(searchKeyword.toLowerCase());

  if (tab === 'follower') {
    return matchesSearch;
  }

  if (tab === 'following') {
    return (
      matchesSearch &&
    (user.buttonType === '팔로잉' || user.buttonType === '모아참여중' || user.buttonType === '모아참여')
    );
  }

  return false; // 혹시 모를 예외 대비
});


  const handleUnfollowClick = (id: string) => {
    setSelectedUserId(id);
    setShowUnfollowModal(true);
  };

const handleConfirmUnfollow = () => {
  if (selectedUserId) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUserId
          ? { ...user, buttonType: '맞팔로우' }
          : user
      )
    );
  }
  setShowUnfollowModal(false);
  setSelectedUserId(null);
};

  const renderButton = (type: FollowType, id: string) => {
    const base =
      'flex justify-center items-center rounded-[10px] font-pretendard text-[14px] font-bold leading-[22px]';

    switch (type) {
      case '모아참여':
        return (
          <button
            className={`${base} px-[24px] py-[6px] border border-[#6282E1] bg-[#FFF] text-[#6282E1]`}
          >
            모아 참여
          </button>
        );
      case '맞팔로우':
        return (
          <button
            className={`${base} px-[24px] py-[6px] bg-[#6282E1] !text-[#FFF]`}
          >
            맞팔로우
          </button>
        );
      case '모아참여중':
        return (
          <button
            disabled
            className={`${base} px-[10px] py-[8px] bg-transparent text-[#6282E1] border border-transparent`}
          >
            모아 참여 중
          </button>
        );
      case '팔로잉':
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
          onClick={(e) => e.stopPropagation()} // 바깥 클릭 시 닫힘 방지
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

      {/* 탭 메뉴 */}
 <div className="relative w-full max-w-[350px] mx-auto">
  <div className="flex justify-between w-full z-10">
    <button
      onClick={() => setTab('follower')}
      className="w-1/2 pb-[10px] bg-transparent"
    >
      <span
        className={`block text-center font-pretendard text-[18px] font-semibold ${
          tab === 'follower' ? 'text-[#6282E1]' : 'text-[#C7D5FF]'
        }`}
      >
        팔로워
      </span>
    </button>
    <button
      onClick={() => setTab('following')}
      className="w-1/2 pb-[10px] bg-transparent"
    >
      <span
        className={`block text-center font-pretendard text-[18px] font-semibold ${
          tab === 'following' ? 'text-[#6282E1]' : 'text-[#C7D5FF]'
        }`}
      >
        팔로잉
      </span>
    </button>
  </div>
  <div className="absolute bottom-[-8px] w-full h-[1px] bg-[#C7D5FF]" />
  <div
    className={`absolute bottom-[-8px] h-[3px] w-1/2 bg-[#6282E1] transition-all duration-300 ${
      tab === 'follower' ? 'left-0' : 'left-1/2'
    }`}
  />
</div>


      {/* 검색창 */}
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
/>        </div>
      </div>

      {/* 유저 목록 */}
      <div className="px-[20px] space-y-[20px]">
{filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-[12px] cursor-pointer"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <img
                src={ProfileIcon}
                alt="profile"
                className="w-[64px] h-[64px] rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold font-pretendard">
                  {user.nickname}
                </span>
                <span className="text-[16px] font-normal font-pretendard text-[#B7B7B7]"style={{ fontWeight: 600 }}
>
                  {user.date}{' '}
                  <span className="text-[#E25C5C] text-[18px] font-semibold"style={{ fontWeight: 400 }}
>({user.dDay})</span>
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
