import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDemoEvent, getMyDemoEvent, type DemoEvent } from "../../../../services/demo";

interface ShareLinkPopupProps {
  isOpen: boolean;
  shareUrl: string;
  onClose: () => void;
}

const ShareLinkPopup = ({ isOpen, shareUrl, onClose }: ShareLinkPopupProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] p-6 mx-4 max-w-[320px] w-full">
        <h3 className="text-[18px] font-semibold text-center mb-4">
          모아 참여 링크가 생성되었어요!
        </h3>
        
        <div className="bg-gray-50 rounded-[8px] p-3 mb-4">
          <p className="text-[12px] text-gray-600 mb-2">공유 링크</p>
          <p className="text-[14px] text-gray-800 break-all">{shareUrl}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 h-[44px] bg-[#6282E1] text-white rounded-[8px] text-[14px] font-medium"
          >
            {copied ? "복사 완료!" : "링크 복사"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[44px] bg-gray-200 text-gray-800 rounded-[8px] text-[14px] font-medium"
          >
            닫기
          </button>
        </div>

        <p className="text-[12px] text-gray-500 text-center mt-3">
          이 링크를 친구들에게 공유하면<br />
          편지를 받을 수 있어요!
        </p>
      </div>
    </div>
  );
};

const CreateMoaLinkButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [hasDemo, setHasDemo] = useState(false); // 데모 이벤트 존재 여부

  // 컴포넌트 마운트 시 기존 데모 이벤트 확인
  useEffect(() => {
    const checkExistingDemo = async () => {
      try {
        await getMyDemoEvent();
        setHasDemo(true);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setHasDemo(false);
        }
      }
    };
    checkExistingDemo();
  }, []);

  const handleCreateLink = async () => {
    try {
      setLoading(true);
      setError(null);

      // 기존 데모 이벤트가 있는지 먼저 확인
      let demoEvent: DemoEvent;
      try {
        demoEvent = await getMyDemoEvent();
      } catch (err: any) {
        // 없으면 새로 생성
        if (err.response?.status === 404) {
          demoEvent = await createDemoEvent();
        } else {
          throw err;
        }
      }

      // 백엔드에서 shareUrl을 제공하지만, 현재 도메인 기준으로 다시 생성
      const currentDomain = window.location.origin;
      const shareUrl = `${currentDomain}/demo/${demoEvent.shareLink}`;
      
      setShareUrl(shareUrl);
      setShowPopup(true);
      setHasDemo(true); // 성공 후 상태 업데이트
    } catch (err: any) {
      setError(err.response?.data?.message || "링크 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMyDemo = () => {
    // 내 데모 편지들 조회 페이지로 이동
    navigate('/demo/my-letters');
  };

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-[#6282E1] px-1 mb-[16px]">
        내 모아 참여 링크 생성
      </h2>

      <div className="w-[350px] mx-auto">
        {/* 이미지와 텍스트 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-[64px] h-[64px] rounded-full bg-[#6282E1] flex items-center justify-center">
              <img 
                src="/assets/MoaProfile.svg" 
                alt="모아 프로필" 
                className="w-[64px] h-[64px]"
              />
            </div>
            
            {/* 버튼을 이미지 바로 아래에 배치 */}
            <button
              onClick={hasDemo ? handleViewMyDemo : handleCreateLink}
              disabled={loading}
              className="w-[64px] h-[24px] rounded-[6px] text-[11px] font-bold text-[#6282E1] border border-[#6282E1] bg-white disabled:bg-gray-400 disabled:text-white disabled:border-gray-400"
            >
              {loading 
                ? "생성 중" 
                : hasDemo 
                ? "모아 조회" 
                : "모아 생성"
              }
            </button>
          </div>

          <div className="flex-1">
            <p className="text-[16px] text-black">친구들에게 편지를 받아보세요!</p>
            <p className="text-[14px] text-[#B7B7B7]">링크를 공유하면 편지를 받을 수 있어요</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-[12px] text-center mt-2">{error}</div>
      )}

      <ShareLinkPopup
        isOpen={showPopup}
        shareUrl={shareUrl}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
};

export default CreateMoaLinkButton;
