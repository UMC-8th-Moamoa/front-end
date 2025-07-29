import { useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import ProfileImg from '../../assets/profile.svg';
import RightArrow from '../../assets/Right_gray.svg';
import ParticipationIcon from '../../assets/Participation.svg';
import HeartIcon from '../../assets/Heart.svg';
import GiftIcon from '../../assets/Gift.svg';
import WishImage from '../../assets/Wishitem.svg';
import ShareIcon from '../../assets/Share.svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Gmail from '../../assets/Gmail_logo.svg';
import Kakao from '../../assets/Kakaotalk_logo.svg';
import Discord from '../../assets/Discord_logo.svg';
import Instagram from '../../assets/Instagram_logo.svg';
import X from '../../assets/X_logo.svg';
import Copy from '../../assets/Copy.svg';

function OtherUserProfilePage() {
const [isShareModalOpen, setIsShareModalOpen] = useState(false);
const [showRemoveFollowerModal, setShowRemoveFollowerModal] = useState(false);
const [isFollowerRemoved, setIsFollowerRemoved] = useState(false);
const [showUnfollowModal, setShowUnfollowModal] = useState(false);
const [isFollowing, setIsFollowing] = useState(true); // 기본: 팔로우 중
const { id } = useParams();
const navigate = useNavigate(); 

  const keywords = ['#향수', '#반려용품', '#목걸이', '#디저트', '#디퓨저', '#모자'];
  const wishItems = [
    '딥디크 필로시코스 오드뚜왈렛',
    '딥디크 필로시코스 오드뚜왈렛',
    '딥디크 필로시코스 오드뚜왈렛',
  ];

  const summaryList = [
    { title: '모아 참여 횟수', count: '4회', icon: ParticipationIcon },
    { title: '모아를 받은 횟수', count: '2회', icon: HeartIcon },
    { title: '참여 중인 모아', count: '2개', icon: GiftIcon },
  ];


  {/*팔로우삭제모달*/}
  return (
<div className="max-w-[393px] mx-auto bg-white min-h-screen text-black">
{showRemoveFollowerModal && (
  <div
    className="w-[393px] h-[844px] fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
    onClick={() => setShowRemoveFollowerModal(false)}
  >
    <div
      className="bg-[#FFF] rounded-[20px] px-[40px] flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-semibold text-[17px] mb-[20px] mt-[31px]">팔로워를 삭제하시겠습니까?</p>
      <div className="flex gap-4">
        <button
          onClick={() => setShowRemoveFollowerModal(false)}
          className="flex justify-center mb-[31px] items-center mr-[12px] h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-pretendard font-medium"
        >
          취소
        </button>
        <button
          onClick={() => {
            setIsFollowerRemoved(true); // 팔로워 삭제 처리
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

{/*팔로우취소모달*/}
 {showUnfollowModal && (
  <div
    className="w-[393px] h-[844px] fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
    onClick={() => setShowUnfollowModal(false)}
  >
    <div
      className="bg-[#FFF] rounded-[20px] px-[40px] flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-semibold text-[17px] mb-[20px] mt-[31px]">
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
          onClick={() => {
            setIsFollowing(false); // 팔로우 취소 처리
            setShowUnfollowModal(false);
          }}
          className="flex justify-center items-center h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-white text-[18px] font-pretendard font-medium"
        >
          확인
        </button>
      </div>
    </div>
  </div>
)}
{isShareModalOpen && (
  <div className="fixed inset-0 w-[393px] h-[844px] z-[9999] flex flex-col justify-end">
    {/* 어두운 배경 */}
    <div
      className="absolute w-[393px] h-[844px] inset-0 bg-[rgba(0,0,0,0.25)]"
      onClick={() => setIsShareModalOpen(false)}
    />

    {/* 공유 모달 */}
    <div className="relative w-[350px] h-[267px]  bg-[#FFF]  rounded-t-[40px] mx-auto px-[24px] pt-[12px] pb-[24px]">
      {/* 회색 바 */}
      <div className="w-[74px] h-[6px] rounded-full bg-[#B7B7B7] mx-auto mb-[30px]" />

      {/* 아이콘 리스트 */}
      <div className="flex gap-[20px] overflow-x-auto scrollbar-hide mb-[0px]">
        {[
          { icon: Gmail, label: 'Gmail' },
          { icon: Kakao, label: '카카오톡' },
          { icon: Discord, label: 'Discord' },
          { icon: Instagram, label: 'Instagram' },
          { icon: X, label: 'X' },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center min-w-[60px]">
            <img
              src={item.icon}
              alt={item.label}
              className="w-[54px] h-[54px] rounded-full mb-[6px]"
              style={{ aspectRatio: '1 / 1' }}
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
      .then(() => alert('링크가 복사되었습니다.'))
      .catch(() => alert('복사에 실패했습니다.'));
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
  {/* 상단 바 */}
  <div className="flex items-center justify-between mb-4">
    {/* 왼쪽: BackButton + 이름 */}
    <div className="flex items-center">
      <BackButton />
      <span className="ml-[12px] text-[20px] font-bold"style={{ fontWeight: 700 }}
>금채원</span>
    </div>

    {/* 오른쪽: Share 아이콘 */}
<img
  src={ShareIcon}
  alt="공유"
  onClick={() => setIsShareModalOpen(true)}
  className="cursor-pointer"
/>
  </div>






      {/* 프로필 UI 영역 */}
      <div className="px-[20px] py-[12px]">
        <div className="flex items-start gap-[12px]">
          <div className="flex flex-col items-center gap-[8px]">
            <img
              src={ProfileImg}
              alt="프로필 이미지"
              className="w-[68px] h-[68px] rounded-full object-cover bg-[#B6B6B6]"
            />
          </div>
          <div className="flex-1 mt-[10px] ml-[16px]">
{/* 이름 + 생일 한 줄로 */}
<div className="flex items-center justify-between">
  <span className="text-[20px] font-semibold text-[#1F1F1F] font-pretendard"style={{ fontWeight: 500 }}
>
    chaoni_gold
  </span>
  <span className="text-[16px] text-[#B7B7B7] font-pretendard">
    2002.09.11
  </span>
</div>
            <div className="flex gap-[20px] mt-[8px]">
              <div className="flex items-center gap-[6px]">
                <span className="text-[18px] text-[#B7B7B7] font-pretendard">팔로워</span>
                <span className="text-[20px] text-[#1F1F1F] font-pretendard"style={{ fontWeight: 500 }}
>31</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="text-[18px] text-[#B7B7B7] font-pretendard">팔로잉</span>
                <span className="text-[20px] text-[#1F1F1F] font-pretendard"style={{ fontWeight: 500 }}
>21</span>
              </div>
            </div>
          </div>
        </div>

{/* 버튼 영역 */}
<div className="flex mt-[16px]">
  {isFollowerRemoved ? (
    // 삭제 후: 팔로우 취소하기 or 팔로우 버튼 단독
    isFollowing ? (
      <button
        onClick={() => setShowUnfollowModal(true)}
        className="flex justify-center items-center w-[350px] h-[35px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] font-pretendard"
        style={{ fontWeight: 600 }}
      >
        팔로우 취소하기
      </button>
    ) : (
      <button
        onClick={() => setIsFollowing(true)}
        className="flex justify-center items-center w-[350px] h-[35px] rounded-[10px] bg-[#6282E1] text-[#FFF] font-pretendard"
        style={{ fontWeight: 600 }}
      >
        팔로우
      </button>
    )
  ) : (
    //  기본: 팔로워 삭제 + 맞팔로우
    <div className="flex gap-[10px]">
      <button
        onClick={() => setShowRemoveFollowerModal(true)}
        className="flex justify-center items-center w-[168px] h-[35px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[16px] font-semibold font-pretendard"
        style={{ fontWeight: 600 }}
      >
        팔로워 삭제
      </button>
      <button
        className="flex justify-center items-center w-[168px] h-[35px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[16px] font-semibold font-pretendard"
        style={{ fontWeight: 600 }}
      >
        맞팔로우
      </button>
    </div>
  )}
</div>




        <div className="w-[350px] h-[1px] bg-[#E1E1E1] mt-[16px] mx-auto" />
      </div>

{/* 해시태그 리스트 (가로 스크롤) */}
<div className="px-[20px]">
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex gap-[8px] mb-[10px] flex-nowrap w-max">
      {keywords.map((tag, index) => (
        <div
          key={index}
          className="flex-shrink-0 px-[14px] py-[4px] rounded-full bg-[#E7EDFF] text-[#6282E1] text-[14px] font-medium font-pretendard"
        >
          {tag}
        </div>
      ))}
    </div>
  </div>

  {/* 모아 참여 요약 */}
  <div className="flex justify-between px-[20px] py-[21px] bg-white rounded-[20px] shadow-[0px_2px_4px_rgba(0,0,0,0.15)] mb-[24px]">
    {summaryList.map((item, index) => (
      <div key={index} className="flex flex-col items-center gap-[10px]">
        <img src={item.icon} alt={item.title} className="h-[34px]" />
        <div className="text-[12px] font-medium text-[#000000] font-pretendard">
          {item.title}
        </div>
        <div className="text-[18px] font-bold text-[#B7B7B7] font-pretendard"style={{ fontWeight: 700 }}
>
          {item.count}
        </div>
      </div>
    ))}
  </div>

  {/* 위시리스트 타이틀 */}
<div className="flex justify-between items-center mb-[12px]">
  <span className="text-[#6282E1] text-[18px] font-bold leading-[22px] font-pretendard" style={{ fontWeight: 700 }}>
    위시리스트
  </span>

  <div
    className="flex items-center gap-[2px] cursor-pointer"
    onClick={() => navigate(`/user/${id}/wishlist`)} // id는 useParams나 props에서 받아야 해
  >
    <span className="text-[#B7B7B7] text-[12px] font-medium font-pretendard">
      더보기
    </span>
    <img src={RightArrow} alt="더보기 화살표" className="w-[16px] h-[16px]" />
  </div>
</div>


  {/* 위시리스트 카드들 (가로 스크롤) */}
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex gap-[8px] flex-nowrap w-max">
      {wishItems.map((item, index) => (
        <div key={index} className="flex flex-col shrink-0 w-[119px]">
          <div
            className="w-[119px] h-[119px] rounded-[16px] bg-[#E1E1E1] mb-[6px]"
            style={{
              backgroundImage: `url(${WishImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="text-[#1F1F1F] text-[12px] font-normal font-pretendard leading-normal">
            {item}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

</div>

  );
}

export default OtherUserProfilePage;
