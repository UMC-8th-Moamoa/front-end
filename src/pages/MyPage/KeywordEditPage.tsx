import { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import KeywordCategorySection from '../../components/mypage/KeywordCategorySection';

// 모달 컴포넌트 정의
function KeywordLimitModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 2초 후 자동 닫힘
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
<div
  style={{
    position: 'fixed',
    top: 0, // 맨 위에 붙임
    left: '50%', // 가로 중앙
    transform: 'translateX(-50%)', // 가로 중앙 정렬만 적용
    width: '350px',
    height: '77px',
    zIndex: 1000,
    backgroundColor: '#FFF', // 완전 흰 배경
    borderRadius: '10px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.20)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>

<div
  className="bg-[#FFF] rounded-[10px] px-[39.5px] py-[16px] text-center shadow-[0_4px_8px_0_rgba(0,0,0,0.20)]"
>


        <div
          style={{
            color: '#1F1F1F',
            fontFamily: 'Pretendard',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          더 이상의 키워드를 추가할 수 없습니다
        </div>
        <div
          style={{
            color: '#B7B7B7',
            fontSize: '16px',
            fontWeight: 500,
            fontFamily: 'Pretendard',
            marginTop: '4px',
          }}
        >
          최대 10개의 키워드 적용 가능
        </div>
      </div>
    </div>
  );
}


function KeywordEditPage() {
  const [myKeywords, setMyKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem('myKeywords');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const maxKeywords = 10;

  useEffect(() => {
    localStorage.setItem('myKeywords', JSON.stringify(myKeywords));
  }, [myKeywords]);

  const handleAddKeyword = (keyword: string) => {
    if (myKeywords.length >= maxKeywords) {
      setShowLimitModal(true);
      return;
    }
    if (!myKeywords.includes(keyword)) {
      setMyKeywords([...myKeywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setMyKeywords(myKeywords.filter((item) => item !== keyword));
  };

  const handleInputAdd = () => {
    const newKeyword = `#${inputValue.trim()}`;
    if (inputValue.trim() === '') return;
    if (!myKeywords.includes(newKeyword)) {
      handleAddKeyword(newKeyword);
      setInputValue('');
    }
  };


  return (
    <div
      style={{
        maxWidth: '350px',
        margin: '0 auto',
        paddingBottom: '80px',
        padding: '0 16px',
        overflowX: 'hidden',
        position: 'relative', // 모달 덮어씌우기 위한 기준
      }}
    >
      {/* 상단 타이틀 + 뒤로가기 */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '16px 0' }}>
        <BackButton />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#1F1F1F',
            fontFamily: 'Pretendard',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '22px',
          }}
        >
          나의 키워드
        </div>
      </div>

      {/* 키워드 입력창 */}
      <div
        style={{
          display: 'flex',
          padding: '15px 207px 16px 26px',
          alignItems: 'center',
          borderRadius: '10px',
          background: '#F2F2F2',
          marginBottom: '12px',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="나의 키워드 만들기"
          onKeyDown={(e) => e.key === 'Enter' && handleInputAdd()}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#1F1F1F',
            fontFamily: 'Pretendard',
            fontSize: '16px',
            fontWeight: 400,
            width: '350px',
          }}
        />
      </div>

{/* 키워드 리스트 + 개수 카운트 */}
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  }}
>
  {/* 스크롤 되는 키워드 리스트 */}
  <div
    style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      flex: 1,
      paddingBottom: '4px',
    }}
  >
    {myKeywords.map((keyword, idx) => (
      <div
        key={idx}
        onClick={() => handleRemoveKeyword(keyword)}
        style={{
          display: 'inline-flex',
          padding: '6px 14px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          borderRadius: '20px',
          backgroundColor: '#6282E1',
          color: '#fff',
          fontFamily: 'Pretendard',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {keyword} ✕
      </div>
    ))}
  </div>

  {/* 고정된 개수 카운트 */}
  <div
    style={{
      marginLeft: '8px',
      fontFamily: 'Pretendard',
      fontSize: '14px',
      fontWeight: 500,
      color: myKeywords.length >= maxKeywords ? '#E20938' : '#1F1F1F',
      flexShrink: 0,
    }}
  >
    {myKeywords.length}/{maxKeywords}
  </div>
</div>


      {/* 모달 */}
      {showLimitModal && <KeywordLimitModal onClose={() => setShowLimitModal(false)} />}

      {/* 구분선 */}
      <div
        style={{
          width: '350px',
          height: '0px',
          borderBottom: '1px solid #B7B7B7',
          marginBottom: '16px',
        }}
      />

      {/* 추천 키워드 섹션 */}
      <KeywordCategorySection onAddKeyword={handleAddKeyword} myKeywords={myKeywords} />
    </div>
  );
}

export default KeywordEditPage;
