function ProfilePhotoModal({ onClose, onSelect }: { onClose: () => void; onSelect: (imgUrl: string) => void }) {
  // 테스트용 샘플 이미지 9개
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
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: '16px',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(img)}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ddd',
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={onClose}
          style={{ border: 'none', backgroundColor: '#ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
        </button>
      </div>
    </div>
  );
}

export default ProfilePhotoModal;
