import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import WhiteArrow from '../../assets/white_button.svg'; // 16px 아이콘

function KeywordSection() {
  const navigate = useNavigate();

  // 저장된 키워드를 가져오는 로직
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    const savedKeywords = localStorage.getItem('myKeywords');
    if (savedKeywords) {
      setKeywords(JSON.parse(savedKeywords));
    }
  }, []);

  return (
    <div className="w-[350px] px-[20px] py-[10px] ">
      {/* 타이틀 + 편집 버튼 */}
      <div className="flex justify-between items-center mb-[8px]">
        <div className="text-[18px] font-bold text-[#1F1F1F] font-pretendard leading-[22px]"style={{ fontWeight: 700 }}
>
          나의 키워드 
        </div>
        <button
          onClick={() => navigate('/keyword/edit')}
          style={{
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '100px',
            backgroundColor: '#6282E1',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'Pretendard',
          }}
        >
          편집
          <img src={WhiteArrow} alt="편집 화살표" style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* 키워드 리스트 (가로 스크롤) */}
      <div className="flex overflow-x-auto no-scrollbar gap-[8px]">
        {keywords.length === 0 ? (
          <div className="text-[#B7B7B7] text-[14px] font-pretendard">키워드를 추가해보세요</div>
        ) : (
          keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-[14px] py-[6px] rounded-full bg-[#E7EDFF] text-[#6282E1] text-[14px] font-medium font-pretendard flex items-center justify-center"
            >
              {keyword}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default KeywordSection;
