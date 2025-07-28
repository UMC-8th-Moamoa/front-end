// ProfilePhotoModal.tsx
import FrameIcon from '../../assets/Frame.svg';

function ProfilePhotoModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (imgUrl: string) => void;
}) {
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
    // 배경을 클릭하면 닫힘
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center', // 가운데 정렬
        alignItems: 'flex-end',     // 가운데 정렬
        zIndex: 1000,
        
      }}
    >
      {/* 콘텐츠 클릭 시 닫히지 않게 처리 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '400px',
          padding: '28px 44px 42px 44px',
          borderRadius: '40px',
          background: 'var(--MOA-White, #FFF)',
          boxSizing: 'border-box',
        }}
      >
        {/* 사진 불러오기 버튼 */}
        <button
          style={{
            display: 'flex',
            padding: '13.5px 88px 12.5px 89px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            border: '1px solid #B7B7B7',
            background: '#FFF',
            width: '150px',
          }}
        >
          <img
            src={FrameIcon}
            alt="사진 아이콘"
            style={{ width: '24px', height: '24px', color: '#B7B7B7' }}
          />
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
            <div
              key={idx}
              onClick={() => onSelect(img)}
              style={{
                width: '85px',
                height: '85px',
                borderRadius: '100px',
                background: '#E1E1E1',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoModal;
