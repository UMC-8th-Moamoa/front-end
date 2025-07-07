import { useState } from 'react';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfilePhotoModal from './ProfilePhotoModal';

function ProfileImageSection() {
  const [nickname, setNickname] = useState('chaoni_gold');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/80'); // 기본 이미지
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
      {/* 프로필 사진 */}
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          marginBottom: '8px',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <img src={profileImage} style={{ width: '100%', height: '100%' }} />
        <img
          src={PencilIcon}
          alt="프로필 수정"
          style={{ width: '16px', height: '16px', position: 'absolute', right: 0, bottom: 0 }}
        />
      </div>

      {/* 닉네임 + 연필 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        {isEditing ? (
          <input
            value={nickname}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            style={{
              fontSize: '18px',
              border: 'none',
              borderBottom: '1px solid #000',
              outline: 'none',
              textAlign: 'center',
            }}
          />
        ) : (
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{nickname}</span>
        )}

        <img
          src={PencilIcon}
          alt="닉네임 수정"
          onClick={() => setIsEditing(true)}
          style={{ width: '16px', height: '16px', cursor: 'pointer', marginLeft: '8px' }}
        />
      </div>

      {/* 중복 에러 */}
      {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>{error}</div>}

      {/* 생년월일 */}
      <div style={{ fontSize: '14px', color: '#888888' }}>2002.09.11</div>

      {/* 프로필 사진 선택 모달 */}
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
