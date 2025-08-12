import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileImg from '../../assets/profile.svg';

function ProfileCard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('chaoni_gold');
  const [isEditing, setIsEditing] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

const goToFollowList = (tab: 'follower' | 'following') => {
  navigate(`/mypage/follow-list`, { state: { tab } }); // state로 tab 전달
};


  return (
    <div className="px-[20px] mt-[10px]  ">
      {/* 프로필 전체 박스 */}
      <div className="flex items-start gap-[12px]">
        {/* 왼쪽: 프로필 이미지와 버튼 */}
        <div className="flex flex-col items-center gap-[8px]">
          {/* 프로필 이미지 */}
          <img
            src={ProfileImg}
            alt="프로필 이미지"
            className="w-[80px] h-[80px] rounded-full object-cover bg-[#B6B6B6]"
          />


        </div>

        {/* 오른쪽: 이름, 생일, 아이디, 팔로워/팔로잉 */}
        <div className="flex-1 mt-[10px] ml-[16px]">
          {/* 이름 + 생년월일 */}
          <div className="flex items-center gap-[110px]">
            <span className="text-[18px] font-semibold text-[#1F1F1F] font-pretendard"
              style={{ fontWeight: 600 }}
>금채원</span>
            <span className="text-[16px] font-normal text-[#B7B7B7] font-pretendard">2002.09.11</span>
          </div>

          {/* 아이디 */}
          <div className="mt-[4px] text-[16px] font-medium text-[#1F1F1F] font-pretendard"   style={{ fontWeight: 600 }}
>
            {isEditing ? (
              <input
                value={userId}
                onChange={handleChange}
                onBlur={handleSave}
                className="text-[14px] border border-[#ddd] rounded px-2 py-1 font-pretendard"
              />
            ) : (
              <span>{userId}</span>
            )}
          </div>

          {/* 팔로워 / 팔로잉 */}
          <div className="flex gap-[20px] mt-[8px]">
            {/* 팔로워 */}
            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={() => goToFollowList('follower')}
            >
              <span className="text-[18px] font-medium text-[#B7B7B7] font-pretendard">팔로워</span>
              <span className="text-[18px] font-medium text-[#1F1F1F] font-pretendard "style={{ fontWeight: 500 }}>31</span>
            </div>

            {/* 팔로잉 */}
            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={() => goToFollowList('following')}
            >
              <span className="text-[18px] font-medium text-[#B7B7B7] font-pretendard">팔로잉</span>
              <span className="text-[18px] font-medium text-[#1F1F1F] font-pretendard"style={{ fontWeight: 500 }}>21</span>
            </div>
          </div>
        </div>
      </div>
          {/* 개인정보 편집 버튼 */}
<button
  onClick={() => navigate('/profile/edit')}
  className="flex justify-center items-center gap-[8px] w-[350px] h-[35px] mt-[11px] px-[px] py-0 rounded-[10px] border-[1px] border-[#6282E1] bg-white text-[#6282E1] text-[16px] font-SemiBold font-pretendard"
style={{ fontWeight: 600 }}>
  개인정보 편집
</button>

    </div>
  );
}

export default ProfileCard;
