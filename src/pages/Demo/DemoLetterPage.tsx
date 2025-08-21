import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDemoEventByShareLink, createDemoLetter, type DemoEventPublic } from "../../services/demo";

export default function DemoLetterPage() {
  const { shareLink } = useParams<{ shareLink: string }>();
  const navigate = useNavigate();

  const [eventInfo, setEventInfo] = useState<DemoEventPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [writerName, setWriterName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEventInfo = async () => {
      if (!shareLink) {
        setError("유효하지 않은 링크입니다.");
        setLoading(false);
        return;
      }

      try {
        const event = await getDemoEventByShareLink(shareLink);
        setEventInfo(event);
      } catch (err: any) {
        setError(err.response?.data?.message || "이벤트 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventInfo();
  }, [shareLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareLink || !writerName.trim() || !content.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (writerName.length > 10) {
      setError("이름은 10자 이하로 입력해주세요.");
      return;
    }

    if (content.length > 1000) {
      setError("편지 내용은 1000자 이하로 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await createDemoLetter(shareLink, writerName.trim(), content.trim());
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "편지 전송에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">이벤트 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error && !eventInfo) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-[#6282E1] text-white rounded-[8px]"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-[64px] mb-4">✉️</div>
            <h2 className="text-[20px] font-semibold mb-2">편지가 전송되었어요!</h2>
            <p className="text-gray-600 mb-6">
              {eventInfo?.userName}님에게 마음이 전달되었습니다.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full h-[48px] bg-[#6282E1] text-white rounded-[8px] font-medium"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard">
      {/* 헤더 */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate("/")}
            className="w-6 h-6 flex items-center justify-center"
          >
            <span className="text-gray-600">←</span>
          </button>
          <h1 className="text-[18px] font-semibold">편지 작성</h1>
          <div className="w-6 h-6"></div>
        </div>
      </div>

      {/* 이벤트 정보 */}
      <div className="bg-[#F8F9FF] p-4 border-b border-gray-100">
        <div className="text-center">
          <h2 className="text-[16px] font-semibold text-[#6282E1] mb-1">
            {eventInfo?.userName}님을 위한 편지
          </h2>
          <p className="text-[14px] text-gray-600">
            마음을 담은 편지를 작성해보세요
          </p>
        </div>
      </div>

      {/* 편지 작성 폼 */}
      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* 이름 입력 */}
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              보내는 사람
            </label>
            <input
              type="text"
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder="이름을 입력해주세요 (최대 10자)"
              maxLength={10}
              className="w-full h-[48px] px-3 border border-gray-300 rounded-[8px] focus:outline-none focus:border-[#6282E1]"
            />
          </div>

          {/* 편지 내용 */}
          <div className="flex-1 flex flex-col">
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              편지 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="마음을 담은 편지를 작성해보세요..."
              maxLength={1000}
              className="flex-1 p-3 border border-gray-300 rounded-[8px] focus:outline-none focus:border-[#6282E1] resize-none"
            />
            <div className="text-right text-[12px] text-gray-500 mt-1">
              {content.length}/1000
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 text-[12px] text-center mt-2">{error}</div>
          )}

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={submitting || !writerName.trim() || !content.trim()}
            className="w-full h-[48px] bg-[#6282E1] text-white rounded-[8px] font-medium mt-4 disabled:bg-gray-400"
          >
            {submitting ? "전송 중..." : "편지 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
