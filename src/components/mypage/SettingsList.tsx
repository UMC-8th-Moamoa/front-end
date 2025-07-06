// src/components/mypage/SettingsList.tsx

function SettingsList() {
  const settings = ['설정', '공지사항', '고객센터'];

  return (
    <div style={{ padding: '16px' }}>
      {settings.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #eee',
            cursor: 'pointer', // 클릭 기능은 나중에
          }}
        >
          <span style={{ fontSize: '16px' }}>{item}</span>
          <span style={{ fontSize: '16px' }}>{'>'}</span>
        </div>
      ))}
    </div>
  );
}

export default SettingsList;
