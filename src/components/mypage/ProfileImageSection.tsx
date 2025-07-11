import { useState } from 'react';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfilePhotoModal from './ProfilePhotoModal';

function ProfileImageSection() {
  const [nickname, setNickname] = useState('chaoni_gold');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/85');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (e.target.value === 'umin23') {
      setError('중복되는 아이디입니다.');
    } else {
      setError('');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '24px 20px 12px' }}>
      {/* 프로필 이미지 + 연필 아이콘 */}
      <div style={{ position: 'relative', width: '85px', height: '85px', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
        <div
          style={{
            width: '85px',
            height: '85px',
            borderRadius: '50%',
            backgroundColor: '#B6B6B6',
            overflow: 'hidden',
          }}
        >
          <img src={profileImage} style={{ width: '100%', height: '100%' }} alt="프로필" />
        </div>
        <img
          src={PencilIcon}
          alt="프로필 이미지 수정"
          style={{
            width: '40px',
            height: '40px',
            position: 'absolute',
            bottom: '-10px',
            left: '-8px',
          }}
        />
      </div>

      {/* 텍스트 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 닉네임 + 수정 아이콘 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isEditing ? (
            <input
              value={nickname}
              onChange={handleChange}
              onBlur={() => setIsEditing(false)}
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                outline: 'none',
                flex: 1,
              }}
            />
          ) : (
            <span style={{ fontSize: '20px', fontWeight: 'bold', flex: 1 }}>{nickname}</span>
          )}
          <img
            src={PencilIcon}
            alt="닉네임 수정"
            onClick={() => setIsEditing(true)}
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          />
        </div>

        {/* 밑줄 */}
        <div style={{ height: '1px', backgroundColor: '#B6B6B6', margin: '8px 0' }} />

        {/* 생년월일 */}
        <span style={{ fontSize: '14px', color: '#8F8F8F', fontWeight: 'bold' }}>2002.09.11</span>

        {/* 에러 메시지 */}
        {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <ProfilePhotoModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(imgUrl) => {
            setProfileImage(imgUrl);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ProfileImageSection;
