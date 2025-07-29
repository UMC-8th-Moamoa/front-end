import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import React, { useState } from 'react';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfileIcon from '../../assets/profile.svg';



function ProfileEditPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
const [editingNickname, setEditingNickname] = useState('chaoni_gold'); // 입력 중인 닉네임
const [savedNickname, setSavedNickname] = useState('chaoni_gold');     // 저장된 닉네임
const [isEditing, setIsEditing] = useState(false);
const [error, setError] = useState('');
// 최상단 useEffect 추가
React.useEffect(() => {
  const stored = localStorage.getItem('savedNickname');
  if (stored) {
    setEditingNickname(stored);
    setSavedNickname(stored);
  }
}, []);
// 중복 체크는 입력값 기준으로만
const isDuplicate = editingNickname === 'moa123';

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEditingNickname(value);

  if (value === 'moa123') {
    setError('중복되는 아이디입니다.');
  } else {
    setError('');
  }
};

// handleEditToggle 내부 수정
const handleEditToggle = () => {
  if (!isDuplicate) {
    setSavedNickname(editingNickname);
    localStorage.setItem('savedNickname', editingNickname); // localStorage 저장
    setIsEditing(false);
  }
};



  return (
    <div className="w-full max-w-[350px] mx-auto bg-white text-black pt-[9px] pb-[40px] min-h-screen" >
      {/* 상단 바 */}
      <div className="flex items-center mb-4 px-4">
        <BackButton />
        <div className="flex-1 text-center text-[18px] font-bold"style={{ fontWeight: 700 }}>프로필 편집</div>
        <div className="w-6" />
      </div>

      {/* 프로필 사진 + 폼 감싸는 박스 */}
      <div
        style={{
          margin: '0 auto',
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          maxWidth: '350px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* 프로필 이미지 + 닉네임 */}
        <div className="flex px-[8px]">
          <div
            style={{
              width: '85px',
              height: '85px',
              position: 'relative',
              flexShrink: 0,
              marginRight: '16px',
              cursor: 'pointer',
            }}
            onClick={() => setIsModalOpen(true)}
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

          {/* 닉네임 */}
          <div className="flex flex-col flex-grow">
<div
  style={{
    position: 'relative',
    width: '204px', // 고정 너비로 설정
    paddingBottom: '8px',
            fontWeight: 600,

  }}
>
  {isEditing ? (
    <input
      value={editingNickname}
      onChange={handleChange}
      style={{
        fontSize: '24px',
        fontWeight: 600,
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '100%',
        color: error ? '#E20938' : '#000',
      }}
    />
  ) : (
    <span
      style={{
        fontSize: '24px',
        fontWeight: 'Regular',
        display: 'inline-block',
        width: '100%',
        color: error ? '#E20938' : '#000',
      }}
    >
      {editingNickname}
    </span>
  )}

  {/* 연필 아이콘 - 항상 오른쪽 고정 */}
  <img
    src={PencilIcon}
    alt="닉네임 수정"
    onClick={() => {
      if (isEditing) {
        if (!isDuplicate) {
          handleEditToggle();
        }
      } else {
        setIsEditing(true);
      }
    }}
    style={{
      position: 'absolute',
      top: '2px',
      right: 0,
      width: '24px',
      height: '24px',
      cursor: 'pointer',
    }}
  />

  {/* 밑줄 */}
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '1px',
      backgroundColor: error ? '#E20938' : '#B7B7B7',
    }}
  />
</div>

            {error && <div style={{ color: '#E20938', fontSize: '14px' }}>{error}</div>}
                        <span style={{ fontSize: '16px', color: '#B7B7B7' }}>2002.09.11</span>

          </div>
        </div>

        {/* 계정 정보 */}
        <div className="flex flex-col gap-[20px] w-full">
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>계정 정보</span>
          </div>

          <Row label="이름" value="금채원" />
          <Row label="사용자 ID" value={savedNickname} />
          <Row label="전화번호" value="010-1234-5678" />
          <Row label="이메일" value="user@email.com" />
          <Row label="비밀번호" value="" actionLabel="변경" onActionClick={() => alert('비밀번호 변경')} />
        </div>
      </div>

      {/* 프로필 사진 모달 */}
      {isModalOpen && (
        <ProfilePhotoModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(imgUrl) => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

// 공통 Row 컴포넌트
function Row({
  label,
  value,
  actionLabel,
  onActionClick,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onActionClick?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // 부모 박스 꽉 채우기
      }}
    >
      <span
        style={{
          color: '#B7B7B7',
          fontSize: '16px',
          minWidth: '80px',
          flexShrink: 0, // 왼쪽 텍스트 줄어들지 않게
        }}
      >
        {label}
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flex: 1, // 오른쪽 영역이 남은 공간을 채움
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            color: '#1F1F1F',
            fontSize: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
        {actionLabel && (
          <span
            onClick={onActionClick}
            style={{
              color: '#B6B6B6',
              fontSize: '16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginLeft: '8px',
              flexShrink: 0, // 변경 버튼은 고정 폭 유지
            }}
          >
            {actionLabel}
          </span>
        )}
      </div>
    </div>
  );
}


export default ProfileEditPage;
