import { useNavigate } from 'react-router-dom';

function KeywordSection() {
  const navigate = useNavigate();

  const keywords = ['#향수', '#반려용품', '#목걸이', '#디저트', '#캠핑'];

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 타이틀 + 편집 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '16px', color: '#000000' }}>나의 키워드</div>
        <button
          onClick={() => navigate('/keyword/edit')}
          style={{
            border: '1px solid #DDDDDD',
            borderRadius: '12px',
            padding: '4px 12px',
            fontSize: '12px',
            backgroundColor: '#FFFFFF',
            color: '#000',
            height: '28px',
            lineHeight: '16px',
            cursor: 'pointer',
          }}
        >
          편집
        </button>
      </div>

      {/* 키워드 리스트 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 8px', // row gap 10px, column gap 8px (피그마 기준)
        }}
      >
        {keywords.map((keyword, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#F5F5F5',
              color: '#000',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              lineHeight: '22px',
              border: '1px solid #E0E0E0',
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
