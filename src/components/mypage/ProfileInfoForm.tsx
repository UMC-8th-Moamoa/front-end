function ProfileInfoForm() {
  return (
    <div
      style={{
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        width: '90%',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* 계정 정보 제목 */}
      <div>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>계정 정보</span>
      </div>

      {/* 이름 */}
      <Row label="이름" value="금채원" />

      {/* 사용자 ID */}
      <Row label="사용자 ID" value="chaoni_gold" />

      {/* 전화번호 */}
      <Row label="전화번호" value="010-1234-5678" />

      {/* 이메일 + 변경 */}
      <Row label="이메일" value="user@email.com" actionLabel="변경" onActionClick={() => alert('이메일 변경')} />

      {/* 비밀번호 + 변경 */}
      <Row label="비밀번호" value="" actionLabel="변경" onActionClick={() => alert('비밀번호 변경')} />
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#777777', fontSize: '14px', minWidth: '80px' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#333333', fontSize: '16px' }}>{value}</span>
        {actionLabel && (
          <span
            onClick={onActionClick}
            style={{
              color: '#B6B6B6',
              fontSize: '16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {actionLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProfileInfoForm;
