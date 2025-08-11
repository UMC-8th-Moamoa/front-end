import React, { useEffect, useState } from 'react';
import BackIcon from '../../assets/backbutton.svg';
import CustomerCard from '../../components/mypage/CustomerCard';
import PlusIcon from '../../assets/Plus.svg'; 
import { useNavigate } from 'react-router-dom';

interface Inquiry {
  title: string;
  content: string;
  date: string;
status: '답변 보기' | '답변 대기';
  isLocked: boolean;
  username: string;
}

const mockData: Inquiry[] = [
  // 실제 문의 예시 데이터 (테스트용 10개)
    {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 보기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 보기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 보기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
      {
    title: '제목',
    content: '내용',
    date: '2025.04.06',
    status: '답변 대기',
    isLocked: true,
    username: 'chaoni_gold',
  },
  // 필요한 만큼 복사하여 9개 이상 만들기
  // ...
];

const ITEMS_PER_PAGE = 8;

export default function CustomerServicePage() {
    const navigate = useNavigate(); 

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE);

  // 페이지 수 변경에 따라 currentPage 조정
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const currentItems = mockData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

return (
  <div className="relative flex flex-col items-center bg-white ㄴmin-h-screen mx-auto text-black pb-[120px]">
    {/* 상단바 - 고정 */}
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[350px] h-[60px] flex items-center justify-center z-50 border-b border-[#EAEAEA]"
      style={{ backgroundColor: '#FFF' }}
    >
      {/* BackButton - 왼쪽 고정 */}
      <img
        src={BackIcon}
        alt="back"
        className="absolute left-[20px] cursor-pointer w-[40px] h-[40px]"
        onClick={() => window.history.back()}
      />
      {/* 중앙 고객센터 텍스트 */}
      <h1 className="text-center font-pretendard text-[18px] font-bold leading-[22px] text-[#1F1F1F]">
        고객센터
      </h1>
    </div>

    {/* 상단바 높이만큼 패딩 추가 */}
    <div className="h-[60px]" />



      {/* 문의 카드 리스트 */}
<div className="ml-[20px] flex flex-col items-center gap-[18px] w-[350 px-[16px]">
  {currentItems.map((item, index) => (
    <CustomerCard
      key={index}
      title={item.title}
      content={item.content}
      date={item.date}
      status={item.status}
      isLocked={item.isLocked}
      username={item.username}
      onClick={() => {
        if (item.status === '답변 보기') {
          navigate('/mypage/customer-service/detail', {
            state: {
              title: item.title,
              content: item.content,
              date: item.date,
              username: item.username,
            },
          });
        }
      }}
    />
  ))}
</div>



      {/* 페이지네이션 - 8개 이상일 때만 표시 */}
      {mockData.length > ITEMS_PER_PAGE && (
        <div className="fixed bottom-[24px] flex justify-center w-full left-0">
          <div className="flex items-center gap-[14px]">
            {/* 이전 버튼 */}
            <button
              onClick={handlePrevPage}
              className="text-[24px] font-bold font-pretendard text-black"
              disabled={currentPage === 1}
            >
              &#8249;
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-[14px]  ${
                  currentPage === i + 1
                    ? 'text-[#6282E1] underline font-pretendard font-bold '
                    : 'text-black'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={handleNextPage}
              className="text-[20px] font-pretendard font-bold text-black"
              disabled={currentPage === totalPages}
            >
              &#8250;
            </button>
          </div>
        </div>
      )}

            <button
onClick={() => navigate('/customer-service/write')}
        className="fixed bottom-[24px] right-[20px] w-[56px] h-[56px] rounded-full bg-[#6282E1] shadow-[2px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center z-50"
      >
        <img src={PlusIcon} alt="문의 작성" className="w-[24px] h-[24px]" />
      </button>
    </div>
  );
}
