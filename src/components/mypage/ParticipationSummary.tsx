import ParticipationIcon from '../../assets/Participation.svg'; // 모아 참여 횟수 아이콘
import HeartIcon from '../../assets/Heart.svg'; // 모아를 받은 횟수 아이콘
import GiftIcon from '../../assets/Gift.svg'; // 참여 중인 모아 아이콘

function ParticipationSummary() {
  const summaryList = [
    { title: '모아 참여 횟수', count: '4회', icon: ParticipationIcon },
    { title: '모아를 받은 횟수', count: '2회', icon: HeartIcon },
    { title: '참여 중인 모아', count: '2개', icon: GiftIcon },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '21px 20px',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)', // 그림자
        margin: '20px',
      }}
    >
      {summaryList.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <img
            src={item.icon}
            alt={item.title}
            style={{ height: index === 1 ? '30px' : '34px', marginBottom: '4px' }}
          />
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>{item.title}</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#7A7A7A' }}>{item.count}</div>
        </div>
      ))}
    </div>
  );
}

export default ParticipationSummary;
