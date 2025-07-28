import { useState } from 'react';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfileIcon from '../../assets/profile.svg';
import React from 'react';

interface ProfileImageSectionProps {
  setIsModalOpen?: (open: boolean) => void;
}

function ProfileImageSection({ setIsModalOpen }: ProfileImageSectionProps) {
  const [nickname, setNickname] = useState('chaoni_gold');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const textColor = error ? '#E20938' : '#000000';
  const underlineColor = error ? '#E20938' : '#B7B7B7';

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  if (value === 'umin23') {
    setError('중복되는 아이디입니다.');
    return;
  }

  setError('');
  setNickname(value);
};



  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div
      style={{
        width: '393px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: '23px',
        marginBottom: '40px',
        marginTop: '20px',
      }}
    >
      {/* 프로필 이미지 */}
      <div
        style={{
          width: '85px',
          height: '85px',
          position: 'relative',
          flexShrink: 0,
          marginRight: '16px',
          cursor: 'pointer',
        }}
        onClick={() => setIsModalOpen?.(true)} 
      >
        <img
          src={ProfileIcon}
          alt="프로필 이미지"
          style={{
            width: '85px',
            height: '85px',
            borderRadius: '50%',
            objectFit: 'cover',
            backgroundColor: '#B6B6B6',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '100px',
            background: '#FFF',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <img src={PencilIcon} alt="이미지 수정" style={{ width: '20px', height: '20px' }} />
        </div>
      </div>

      {/* 닉네임 + 생일 */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            paddingBottom: '8px',
            width: 'fit-content',
            maxWidth: '100%',
          }}
        >
          {isEditing ? (
            <input
              value={nickname}
              onChange={handleChange}
              style={{
                fontSize: '24px',
                fontWeight: 600,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: 0,
                margin: 0,
                width: `${nickname.length + 1}ch`,
                color: textColor,
              }}
            />
          ) : (
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                display: 'inline-block',
                width: `${nickname.length + 1}ch`,
                color: textColor,
              }}
            >
              {nickname}
            </span>
          )}

          <img
            src={PencilIcon}
            alt="닉네임 수정"
            onClick={handleToggleEdit}
            style={{
              width: '24px',
              height: '24px',
              marginLeft: '8px',
              cursor: 'pointer',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '1px',
              width: `calc(${nickname.length + 11}ch)`,
              backgroundColor: underlineColor,
            }}
          />
        </div>

        <span style={{ fontSize: '16px', color: '#B7B7B7' }}>2002.09.11</span>

        {error && (
          <div style={{ color: '#E20938', fontSize: '14px' }}>{error}</div>
        )}
      </div>
    </div>
  );
}

export default ProfileImageSection;
