// src/components/mypage/ParticipationSummary.tsx

function ParticipationSummary() {
  const summaryList = [
    { title: '모아 참여 횟수', count: 4 },
    { title: '모아를 받은 횟수', count: 2 },
    { title: '참여 중인 모아', count: 2 },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px' }}>
      {summaryList.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '12px',
            width: '90px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>{item.title}</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{item.count}회</div>
        </div>
      ))}
    </div>
  );
}

export default ParticipationSummary;
