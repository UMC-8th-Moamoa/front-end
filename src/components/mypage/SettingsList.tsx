import { useNavigate } from "react-router-dom";

function SettingsList() {
  const navigate = useNavigate();
  const settings = ['설정', '공지사항', '고객센터'];


  const handleClick = (item: string) => {
    if (item === '설정') {
      navigate('/mypage/settings');
    } else if (item === '공지사항') {
      navigate('/mypage/notice'); // 공지사항 이동
    } else if (item === '고객센터') {
      navigate('/mypage/customer-service'); // 고객센터 이동
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '0 20px' }}>
      {settings.map((item, index) => (
        <div key={index} style={{ paddingTop: index === 0 ? '24px' : '12px' }}>
          {/* 항목 */}
          <div
            onClick={() => handleClick(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#000' }}>{item}</span>
            <span style={{ fontSize: '22px', color: '#A0A0A0' }}>{'>'}</span>
          </div>

          {/* 구분선 */}
          {index !== settings.length - 1 && (
            <div
              style={{
                height: '1px',
                backgroundColor: '#EAEAEA',
                width: '100%',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default SettingsList;
