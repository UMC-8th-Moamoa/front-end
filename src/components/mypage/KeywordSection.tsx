import { useNavigate } from 'react-router-dom';

function KeywordSection() {
  const navigate = useNavigate(); // ✅ 꼭 필요

  const keywords = ['#향수', '#반려용품', '#목걸이', '#디저트', '#캠핑'];

  return (
    <div style={{ padding: '16px' }}>
      {/* 타이틀 + 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>나의 키워드</div>
        <button
          onClick={() => navigate('/keyword/edit')} // ✅ 여기에 navigate 추가
          style={{
            border: '1px solid #DDDDDD',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '12px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            color: '#000000',
          }}
        >
          편집
        </button>
      </div>

      {/* 키워드 태그 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {keywords.map((keyword, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#F5F5F5',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              color: '#000000',
            }}
          >
            {keyword}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeywordSection;
