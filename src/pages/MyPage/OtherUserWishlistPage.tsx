import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import Perfume from '../../assets/Perfume.svg';
import React from 'react';

export default function OtherUserWishlistPage() {
  const navigate = useNavigate();

  // 더미 데이터
  const wishlist = [
    { id: 1, name: '딥디크 필로시코스 오드 뚜왈렛', price: '100,000원' },
    { id: 2, name: '딥디크 필로시코스 오드 뚜왈렛', price: '100,000원' },
    { id: 3, name: '딥디크 필로시코스 오드 뚜왈렛', price: '100,000원' },
    { id: 4, name: '딥디크 필로시코스 오드 뚜왈렛', price: '100,000원' },
    { id: 4, name: '딥디크 필로시코스 오드 뚜왈렛', price: '100,000원' },

  ];

  const isFollowing = true; // TODO: API 연동 후 상태로 관리

  return (
    <div className="relative max-w-[393px] mx-auto min-h-screen bg-white text-black">
      {/*  고정된 상단바 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[393px] z-[1000] bg-white px-[20px]  pb-[16px]">
        <div className="flex items-center gap-[60px]">
          <BackButton />
          <h1 className="text-[18px] font-bold font-pretendard">채원님의 위시리스트</h1>
        </div>
      </div>
     {/*  상단바 높이만큼 아래로 밀기 */}
      <div className="pt-[40px] px-[20px] pb-[40px]"></div>

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
                <span className="text-[14px] py-[12px] mb-[28px] font-medium text-[#1F1F1F]">{item.name}</span>
                <span className="text-[20px]  font-bold text-[#1F1F1F] mt-[6px]"style={{ fontWeight: 600 }}
>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-[60px] text-[#8F8F8F] text-[15px] font-medium">
          이 사용자의 위시리스트는 팔로우 후에 볼 수 있어요.
        </div>
      )}
    </div>
  );
}
