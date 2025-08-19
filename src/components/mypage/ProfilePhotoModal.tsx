// src/components/mypage/ProfilePhotoModal.tsx
import { useRef } from 'react';
import FrameIcon from '../../assets/Frame.svg';

// 로컬 프리셋 9종 (png)
import P1 from '../../assets/profile/profile1.png';
import P2 from '../../assets/profile/profile2.png';
import P3 from '../../assets/profile/profile3.png';
import P4 from '../../assets/profile/profile4.png';
import P5 from '../../assets/profile/profile5.png';
import P6 from '../../assets/profile/profile6.png';
import P7 from '../../assets/profile/profile7.png';
import P8 from '../../assets/profile/profile8.png';
import P9 from '../../assets/profile/profile9.png';

function ProfilePhotoModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (imgUrl: string, file?: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(url, file);
  };

  const presetImages = [P1, P2, P3, P4, P5, P6, P7, P8, P9];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '400px',
          padding: '28px 44px 42px 44px',
          borderRadius: '40px',
          background: '#FFF',
          boxSizing: 'border-box',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            padding: '13.5px 8px 12.5px 8px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            border: '1px solid #B7B7B7',
            background: '#FFF',
            width: '250px',
          }}
        >
          <img src={FrameIcon} alt="사진 아이콘" style={{ width: '24px', height: '24px' }} />
          <span style={{ marginLeft: '8px', fontWeight: 500, color: '#B7B7B7' }}>
            사진 불러오기
          </span>
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '30px',
            justifyItems: 'center',
          }}
        >
          {presetImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(img)}
              style={{
                width: '85px',
                height: '85px',
                borderRadius: '100px',
                overflow: 'hidden',
                background: '#E1E1E1',
                cursor: 'pointer',
                padding: 0,
                border: 'none',
              }}
              aria-label={`프리셋 프로필 ${idx + 1}`}
            >
              <img
                src={img}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoModal;
