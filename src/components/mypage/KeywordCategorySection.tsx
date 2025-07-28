interface Props {
  onAddKeyword: (keyword: string) => void;
  myKeywords: string[];
}

function KeywordCategorySection({ onAddKeyword, myKeywords }: Props) {
  const categories = [
    {
      title: '감성소품 & 취미',
      keywords: ['#감성소품', '#인테리어 소품', '#캔들 / 디퓨저', '#드로잉 키트', '#조명', '#엽서 / 액자', '#DIY 키트'],
    },
    {
      title: '패션 & 액세서리',
      keywords: ['#액세서리', '#팔찌 / 목걸이', '#반지', '#모자', '#가방', '#지갑', '#시계', '#신발'],
    },
    {
      title: '먹거리 & 디저트',
      keywords: ['#디저트', '#케이크', '#마카롱', '#초콜릿', '#커피 / 차 세트', '#와인 / 위스키'],
    },
    {
      title: 'IT & 전자기기',
      keywords: ['#이어폰 / 헤드폰', '#스마트워치', '#태블릿 거치대', '#휴대폰 케이스', '#블루투스 스피커'],
    },
    {
      title: '뷰티 & 케어',
      keywords: ['#향수', '#기초 화장품', '#색조 화장품', '#헤어케어 제품', '#립스틱'],
    },
    {
      title: '취미 & 엔터테인먼트',
      keywords: ['#보드게임', '#피규어', '#레고', '#캐릭터 굿즈', '#퍼즐'],
    },
    {
      title: '기타',
      keywords: ['#커플템', '#반려동물 용품', '#자기계발 도서'],
    },
  ];

  return (
    <div>
      {categories.map((category, idx) => (
        <div key={idx} style={{ marginBottom: '22px' }}>
          <div
            style={{
              color: '#6282E1', // title color
              fontFamily: 'Pretendard',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: 'normal',
              marginBottom: '12px',
            }}
          >
            {category.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {category.keywords.map((keyword, idx2) => {
              const isSelected = myKeywords.includes(keyword);
              return (
                <button
                  key={idx2}
                  onClick={() => onAddKeyword(keyword)}
                  style={{
                    display: 'flex',
                    padding: '6px 14px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '100px',
                    background: isSelected ? '#E6ECF9' : '#F2F2F2',
                    color: isSelected ? '#97B1FF' : '#1F1F1F',
                    fontFamily: 'Pretendard',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeywordCategorySection;
