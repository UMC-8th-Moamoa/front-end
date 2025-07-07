import { useNavigate } from 'react-router-dom';
import PencilIcon from '../../assets/pencil_line.svg';
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

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
      {/* 프로필 사진 */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          marginRight: '16px',
        }}
      />

      {/* 유저 정보 */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>금채원</div>
        <div style={{ color: '#888', fontSize: '14px' }}>2002.09.11</div>

        {/* 아이디 + 연필 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          {isEditing ? (
            <input
              value={userId}
              onChange={handleChange}
              onBlur={handleSave}
              style={{ fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 4px' }}
            />
          ) : (
            <span style={{ fontSize: '14px' }}>{userId}</span>
          )}
          <img src={PencilIcon} alt="수정" style={{ width: '16px', height: '16px', cursor: 'pointer', marginLeft: '8px' }} onClick={() => setIsEditing(true)} />
        </div>

        {/* 팔로워/팔로잉 */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '14px', marginTop: '4px' }}>
          <div>팔로워 <span style={{ fontWeight: 'bold' }}>31</span></div>
          <div>팔로잉 <span style={{ fontWeight: 'bold' }}>21</span></div>
        </div>
      </div>

      {/* 프로필 편집 버튼 */}
      <button
        onClick={() => navigate('/profile/edit')}
        style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: 'white',
          cursor: 'pointer',
        }}
      >
        프로필 편집
      </button>
    </div>
  );
}

export default ProfileCard;
