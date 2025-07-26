import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../components/common/Modal';
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
  const [tab, setTab] = useState<'follower' | 'following'>('follower');
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: '1', nickname: '골드', date: '6월 21일', dDay: 'D-7', buttonType: '모아참여' },
    { id: '2', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '맞팔로우' },
    { id: '3', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '모아참여중' },
    { id: '4', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
    { id: '5', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
    { id: '6', nickname: '금채원', date: '6월 21일', dDay: 'D-7', buttonType: '팔로잉' },
  ]);

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
    <div className="max-w-[393px] mx-auto min-h-screen bg-white text-black">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <BackButton />
        <div className="w-6 h-6" />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex flex-col items-center mt-[30px] relative w-full">
        <div className="flex justify-center gap-[90px] w-[350px] z-10">
          <button
            onClick={() => setTab('follower')}
            className="w-[87px] pb-[10px] border-none bg-transparent"
          >
            <span
              className={`text-center font-pretendard text-[16px] font-semibold ${
                tab === 'follower' ? 'text-[#6282E1]' : 'text-[#C7D5FF]'
              }`}
            >
              팔로워
            </span>
          </button>
          <button
            onClick={() => setTab('following')}
            className="w-[87px] pb-[10px] border-none bg-transparent"
          >
            <span
              className={`text-center font-pretendard text-[16px] font-semibold ${
                tab === 'following' ? 'text-[#6282E1]' : 'text-[#C7D5FF]'
              }`}
            >
              팔로잉
            </span>
          </button>
        </div>
        <div className="absolute bottom-[-8px] w-[350px] h-[1px] bg-[#C7D5FF]" />
        <div
          className={`absolute bottom-[-8px] h-[3px] w-[175px] bg-[#6282E1] transition-all duration-300 ${
            tab === 'follower' ? 'left-[20px]' : 'right-[20px]'
          }`}
        />
      </div>

      {/* 검색창 */}
      <div className="flex justify-center mt-[20px] mb-[24px]">
        <div className="w-[350px] h-[50px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-between pl-[25px] pr-[7px]">
          <input
            type="text"
            placeholder="아이디, 이름을 검색하세요"
            className="w-full bg-transparent text-[#1F1F1F] placeholder-[#B7B7B7] font-pretendard text-[16px] font-normal leading-normal outline-none border-none"
          />
          <img src={SearchIcon} alt="search" className="w-[20px] h-[20px]" />
        </div>
      </div>

      {/* 유저 목록 */}
      <div className="px-4 space-y-[20px]">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-[12px] cursor-pointer"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <img
                src={ProfileIcon}
                alt="profile"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold font-pretendard">
                  {user.nickname}
                </span>
                <span className="text-[13px] font-normal font-pretendard text-[#B7B7B7]">
                  {user.date}{' '}
                  <span className="text-[#E25C5C] font-semibold">({user.dDay})</span>
                </span>
              </div>
            </div>

            {renderButton(user.buttonType, user.id)}
          </div>
        ))}
      </div>

      {/* 언팔로우 모달 */}
<Modal isOpen={showUnfollowModal} onClose={() => setShowUnfollowModal(false)}>
  <div
    className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50"
    onClick={() => setShowUnfollowModal(false)}
  >
    <div
      className="bg-[#FFF] rounded-[20px] w-[350px] px-[37px] py-[31px] flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-semibold text-[17px] mb-6">팔로우를 취소하시겠습니까?</p>
      <div className="flex gap-4">
        <button
          onClick={() => setShowUnfollowModal(false)}
          className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-[#FFF] text-[#6282E1] text-[18px] font-pretendard font-medium"
        >
          취소
        </button>
        <button
          onClick={handleConfirmUnfollow}
          className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] !text-[#FFF] text-[18px] font-pretendard font-medium"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</Modal>

    </div>
  );
}
