interface Props {
  onAddKeyword: (keyword: string) => void;
  myKeywords: string[];
}

function KeywordCategorySection({ onAddKeyword, myKeywords }: Props) {
  const categories = [
    { title: '감성소품 & 취미', keywords: ['유럽감성소품', '빈티지소품', '문방구 / 다꾸템', '푸드테크 키트', '포장템', '취미 / 악세', 'DIY 키트'] },
    { title: '패션 & 액세서리', keywords: ['귀걸이', '팔찌', '목걸이', '반지', '모자', '가방', '신발', '시계'] },
    { title: '먹거리 & 디저트', keywords: ['푸딩', '디저트', '마카롱', '초콜릿', '젤리', '차세트', '캔디', '유제품 / 유과소'] },
    { title: 'IT & 전자기기', keywords: ['아이폰', '키보드', '스마트워치', '블루투스거치대'] },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {categories.map((category, idx) => (
        <div key={idx} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{category.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {category.keywords.map((keyword, idx2) => (
              <div
                key={idx2}
                onClick={() => onAddKeyword(keyword)}
                style={{
                  backgroundColor: myKeywords.includes(keyword) ? '#ddd' : '#f5f5f5',
                  color: myKeywords.includes(keyword) ? '#aaa' : '#000',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                }}
              >
                {keyword}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeywordCategorySection;
