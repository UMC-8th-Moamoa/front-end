// src/components/mypage/ParticipationSummary.tsx

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
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px' }}>
      {summaryList.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#F5F5F5',
            padding: '16px',
            borderRadius: '12px',
            width: '90px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#000000',
          }}
        >
          {/* 아이콘 추가 */}
          <img src={item.icon} alt={item.title} style={{ width: '24px', height: '24px', marginBottom: '8px' }} />
          <div style={{ marginBottom: '8px' }}>{item.title}</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#888888' }}>{item.count}</div>
        </div>
      ))}
    </div>
  );
}

export default ParticipationSummary;
