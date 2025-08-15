// 수정할 부분과 앞뒤 맥락 포함
import FrameIcon from '../../assets/Frame.svg';
import { useRef } from 'react';

function ProfilePhotoModal({
  onClose,
  // 변경: 파일도 함께 넘기도록 두 번째 인자 허용
  onSelect,
}: {
  onClose: () => void;
  onSelect: (imgUrl: string, file?: File) => void; // ← 변경
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일 선택 시 호출: 미리보기 URL 생성 후 부모로 전달
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(url, file);
    // 닫을지 여부는 부모에서 결정(여기서는 닫지 않음)
  };

  const images = [
    'https://via.placeholder.com/80/FFB6C1',
    'https://via.placeholder.com/80/87CEFA',
    'https://via.placeholder.com/80/98FB98',
    'https://via.placeholder.com/80/FFD700',
    'https://via.placeholder.com/80/FFA07A',
    'https://via.placeholder.com/80/DDA0DD',
    'https://via.placeholder.com/80/90EE90',
    'https://via.placeholder.com/80/ADD8E6',
    'https://via.placeholder.com/80/FF69B4',
  ];

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
        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          // 모바일에서 카메라를 우선 제안하고 싶으면 capture 속성을 사용할 수 있음(브라우저별 동작 상이)
          // capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* 사진 불러오기 버튼 */}
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

        {/* 사진 선택 목록 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '30px',
            justifyItems: 'center',
          }}
        >
          {images.map((img, idx) => (
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
              aria-label="프로필 이미지 선택"
            >
              {/* 실제 이미지 표시 */}
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
