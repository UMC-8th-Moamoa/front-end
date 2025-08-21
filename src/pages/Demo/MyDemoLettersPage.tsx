import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDemoEvent, getMyDemoLetters, type DemoEvent, type DemoLetter } from "../../services/demo";

export default function MyDemoLettersPage() {
  const navigate = useNavigate();
  const [demoEvent, setDemoEvent] = useState<DemoEvent | null>(null);
  const [letters, setLetters] = useState<DemoLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 데모 이벤트 정보 조회
        const event = await getMyDemoEvent();
        setDemoEvent(event);
        
        // 현재 도메인 기준으로 공유 URL 생성
        const currentDomain = window.location.origin;
        const url = `${currentDomain}/demo/${event.shareLink}`;
        setShareUrl(url);
        
        // 데모 편지들 조회
        const lettersData = await getMyDemoLetters(1, 50);
        setLetters(lettersData.content || []);
        
      } catch (err: any) {
        setError(err.response?.data?.message || "데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleLetterClick = (letterId: number) => {
    navigate(`/demo/letters/${letterId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-[#6282E1] text-white rounded-[8px]"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-[393px] min-h-screen mx-auto font-pretendard"
      style={{ background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigate("/home")}
          className="w-6 h-6 flex items-center justify-center text-white"
        >
          ←
        </button>
        <h1 className="text-[18px] font-semibold text-white">내 모아 편지함</h1>
        <div className="w-6 h-6"></div>
      </div>

      {/* 공유 링크 섹션 */}
      <div className="mx-4 mb-6 bg-white/20 backdrop-blur-sm rounded-[12px] p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-semibold text-white">내 모아 링크</h2>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-white/30 text-white text-[12px] rounded-[6px]"
          >
            {copied ? "복사완료!" : "복사"}
          </button>
        </div>
        <p className="text-[12px] text-white/80 break-all">{shareUrl}</p>
      </div>

      {/* 편지 목록 */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-white">받은 편지</h2>
          <span className="text-[14px] text-white/80">총 {letters.length}개</span>
        </div>

        {letters.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-[12px] p-8 text-center">
            <div className="text-[48px] mb-4">✉️</div>
            <p className="text-white text-[16px] mb-2">아직 받은 편지가 없어요</p>
            <p className="text-white/70 text-[14px]">링크를 친구들에게 공유해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => (
              <div
                key={letter.id}
                onClick={() => handleLetterClick(letter.id)}
                className="bg-white rounded-[12px] p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[14px] font-medium text-gray-800">
                        {letter.writerName}
                      </span>
                      {!letter.isRead && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-600 line-clamp-2">
                      {letter.content.length > 50 
                        ? `${letter.content.substring(0, 50)}...` 
                        : letter.content
                      }
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-[24px] ml-3">💌</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
