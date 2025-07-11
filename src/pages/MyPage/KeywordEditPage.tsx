import { useState } from 'react';
import BackButton from '../../components/common/BackButton';
import BottomNavigation from '../../components/common/BottomNavigation';
import KeywordCategorySection from '../../components/mypage/KeywordCategorySection';

function KeywordEditPage() {
  const [myKeywords, setMyKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const maxKeywords = 10;

  const handleAddKeyword = (keyword: string) => {
    if (myKeywords.length < maxKeywords && !myKeywords.includes(keyword)) {
      setMyKeywords([...myKeywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setMyKeywords(myKeywords.filter((item) => item !== keyword));
  };

  const handleInputAdd = () => {
    if (inputValue.trim() !== '' && !myKeywords.includes(`#${inputValue}`)) {
      handleAddKeyword(`#${inputValue}`);
      setInputValue('');
    }
  };

  return (
    <div style={{ maxWidth: '393px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '16px' }}>
        <BackButton />
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>나의 키워드</div>
      </div>

      {/* 키워드 입력 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', marginBottom: '8px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="나의 키워드 만들기"
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button
          onClick={handleInputAdd}
          style={{ border: 'none', backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
        >
          +
        </button>
      </div>

      {/* 내 키워드 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 16px', marginBottom: '8px' }}>
        {myKeywords.map((keyword, idx) => (
          <div
            key={idx}
            onClick={() => handleRemoveKeyword(keyword)}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '16px',
              cursor: 'pointer',
            }}
          >
            {keyword}
          </div>
        ))}
      </div>

      {/* 카운트 */}
      <div style={{ textAlign: 'right', padding: '0 16px', marginBottom: '16px', fontSize: '14px' }}>
        {myKeywords.length}/10
      </div>

      {/* 추천 키워드 */}
      <KeywordCategorySection onAddKeyword={handleAddKeyword} myKeywords={myKeywords} />

      <BottomNavigation active="mypage" onNavigate={() => {}} />
    </div>
  );
}

export default KeywordEditPage;
