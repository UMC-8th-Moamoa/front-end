// src/components/mypage/ProfileCard.tsx

function ProfileCard() {
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
        <div style={{ fontSize: '14px', color: '#555' }}>chaoni_gold</div>
      </div>

      {/* 프로필 편집 버튼 */}
      <button
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
