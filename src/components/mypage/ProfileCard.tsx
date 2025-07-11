import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    navigate(`/mypage/follow-list?tab=${tab}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 프로필 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* 프로필 이미지 */}
        <div
          style={{
            width: '67px',
            height: '67px',
            borderRadius: '100px',
            backgroundColor: '#B6B6B6',
          }}
        />

        {/* 유저 정보 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>금채원</span>
            <span style={{ fontSize: '14px', color: '#8F8F8F' }}>2002.09.11</span>
          </div>

          {/* 아이디 */}
          <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '15px' }}>
            {isEditing ? (
              <input
                value={userId}
                onChange={handleChange}
                onBlur={handleSave}
                style={{
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '2px 4px',
                }}
              />
            ) : (
              <span>{userId}</span>
            )}
          </div>

          {/* 팔로워 / 팔로잉 */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => goToFollowList('follower')}
            >
              <span style={{ fontSize: '15px', color: '#7A7A7A', fontWeight: 'bold' }}>팔로워</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>31</span>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => goToFollowList('following')}
            >
              <span style={{ fontSize: '15px', color: '#7A7A7A', fontWeight: 'bold' }}>팔로잉</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>21</span>
            </div>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button
          onClick={() => navigate('/profile/edit')}
          style={{
            backgroundColor: '#D9D9D9',
            borderRadius: '10px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          프로필 편집
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
