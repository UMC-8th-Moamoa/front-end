// src/components/mypage/KeywordSection.tsx

function KeywordSection() {
  const keywords = ['#향수', '#반려용품', '#목걸이', '#디저트', '#캠핑'];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {keywords.map((keyword, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
            }}
          >
            {keyword}
          </div>
        ))}
      </div>

      {/* 편집 버튼 (동작은 나중에) */}
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
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
          편집
        </button>
      </div>
    </div>
  );
}

export default KeywordSection;
