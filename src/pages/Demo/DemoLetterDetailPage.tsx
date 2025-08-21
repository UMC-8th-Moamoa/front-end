import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { markDemoLetterAsRead, getDemoLetterById, type DemoLetter } from "../../services/demo";

export default function DemoLetterDetailPage() {
  const { letterId } = useParams<{ letterId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [letter, setLetter] = useState<DemoLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchLetter = async () => {
      if (!letterId) return;
      
      try {
        setLoading(true);
        
        // 데모 편지 상세 조회
        const data = await getDemoLetterById(Number(letterId));
        setLetter(data);
        
        // 읽음 처리
        if (!data.isRead) {
          await markDemoLetterAsRead(Number(letterId));
        }
        
      } catch (err: any) {
        setError(err.response?.data?.message || "편지를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [letterId]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientHeight === 0) return;
    const total = Math.ceil(el.scrollHeight / el.clientHeight);
    const current = Math.floor(el.scrollTop / el.clientHeight) + 1;
    setCurrentPage(current);
    setTotalPage(Math.max(total, 1));
  };

  if (loading) {
    return (
      <div 
        className="w-[393px] h-[794px] mx-auto font-pretendard flex items-center justify-center"
        style={{ background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
      >
        <div className="text-white">불러오는 중...</div>
      </div>
    );
  }

  if (error || !letter) {
    return (
      <div 
        className="w-[393px] h-[794px] mx-auto font-pretendard flex items-center justify-center"
        style={{ background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
      >
        <div className="text-center">
          <div className="text-white mb-4">{error || "편지를 찾을 수 없습니다."}</div>
          <button
            onClick={() => navigate("/demo/my-letters")}
            className="px-4 py-2 bg-white text-[#6282E1] rounded-[8px]"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[393px] h-[794px] mx-auto font-pretendard flex flex-col items-center px-4"
      style={{ background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
    >
      {/* 헤더 */}
      <div className="relative w-[350px] flex items-center mb-[26px] pt-4">
        <button 
          onClick={() => navigate("/demo/my-letters")}
          className="w-6 h-6 flex items-center justify-center text-white"
        >
          ←
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white">
          {letter.writerName}님의 편지
        </h1>
      </div>

      {/* 편지 내용 */}
      <div className="w-[350px] h-[676px] rounded-[20px] flex flex-col justify-end items-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto text-[16px] leading-relaxed text-[#1F1F1F] px-[19px] pt-[16px] pb-[0px] box-border whitespace-pre-wrap"
        >
          {/* 작성자 정보 */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <p className="text-[14px] font-medium text-[#6282E1]">보낸이: {letter.writerName}</p>
            <p className="text-[12px] text-gray-500 mt-1">
              {new Date(letter.createdAt).toLocaleDateString()} {new Date(letter.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          {/* 편지 내용 */}
          {letter.content}
        </div>
      </div>

      {/* 페이지 정보 */}
      <div className="mt-[16px] text-[#FFF] text-[18px] font-medium text-center">
        {currentPage} / {totalPage}
      </div>
    </div>
  );
}
