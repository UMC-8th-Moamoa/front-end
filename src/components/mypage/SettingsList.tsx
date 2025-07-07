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
            borderBottom: '1px solid #EEEEEE',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#000000',
          }}
        >
          <span>{item}</span>
          <span>{'>'}</span>
        </div>
      ))}
    </div>
  );
}

export default SettingsList;
