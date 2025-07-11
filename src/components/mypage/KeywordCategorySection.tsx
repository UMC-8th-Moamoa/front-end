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
