function ProfileInfoForm() {
  return (
    <div
      style={{
        margin: '0 auto',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '90%',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 이름 */}
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', width: '80px' }}>이름</div>
        <div style={{ fontSize: '16px' }}>금채원</div>
      </div>

      {/* 전화번호 */}
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', width: '80px' }}>전화번호</div>
        <div style={{ fontSize: '16px' }}>010-1234-5678</div>
      </div>

      {/* 이메일 */}
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', width: '80px' }}>이메일</div>
        <div style={{ fontSize: '16px' }}>user@email.com</div>
      </div>

      {/* 가입일 */}
      <div style={{ display: 'flex' }}>
        <div style={{ fontSize: '14px', width: '80px' }}>가입일</div>
        <div style={{ fontSize: '16px' }}>2025.01.01</div>
      </div>
    </div>
  );
}

export default ProfileInfoForm;
