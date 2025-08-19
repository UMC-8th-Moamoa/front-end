// src/components/HomePage/Participation/ParticipationActionBox.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import ShareButton from "../../../assets/ShareButton.svg";
import type { EventButtonStatus } from "../../../services/user/event"; // ✅ 타입 전용 import + 경로 수정

interface ParticipationActionBoxProps {
  isMyPage: boolean;
  buttonStatus?: EventButtonStatus | null; // 서버 /participation 응답의 buttonStatus
  onPrimaryClick?: () => void;             // 부모가 직접 라우팅을 처리하고 싶으면 주입
  onShareClick?: () => void;               // 공유 버튼 콜백(그대로 유지)
  actionRoutes?: {
    participate?: string;  // 기본: /select-remittance
    writeLetter?: string;  // 기본: /moaletter/write
    editLetter?: string;   // 기본: /moaletter/edit
  };
}

const ParticipationActionBox = ({
  isMyPage,
  buttonStatus,
  onPrimaryClick,
  onShareClick,
  actionRoutes,
}: ParticipationActionBoxProps) => {
  const navigate = useNavigate();

  // 액션별 라우트 기본값
  const routes = useMemo(
    () => ({
      participate: actionRoutes?.participate ?? "/select-remittance",
      writeLetter: actionRoutes?.writeLetter ?? "/moaletter/write",
      editLetter: actionRoutes?.editLetter ?? "/moaletter/edit",
    }),
    [actionRoutes]
  );

  // 버튼 라벨: 서버에서 온 buttonText 우선
  const primaryLabel = useMemo(() => {
    if (buttonStatus?.buttonText) return buttonStatus.buttonText;
    switch (buttonStatus?.buttonAction) {
      case "WRITE_LETTER":
        return "편지 작성하러 가기";
      case "EDIT_LETTER":
        return "편지 수정하기";
      case "PARTICIPATE":
      default:
        return "모아 참여하기";
    }
  }, [buttonStatus]);

  const handlePrimary = () => {
    // 부모에서 직접 처리하겠다고 주입한 경우 우선 실행
    if (onPrimaryClick) {
      onPrimaryClick();
      return;
    }

    // 서버 액션에 따라 기본 라우팅
    switch (buttonStatus?.buttonAction) {
      case "WRITE_LETTER":
        navigate(routes.writeLetter);
        break;
      case "EDIT_LETTER":
        navigate(routes.editLetter);
        break;
      case "PARTICIPATE":
      default:
        navigate(routes.participate);
        break;
    }
  };

  return (
    <section className="w-full flex flex-col items-center mt-[32px]">
      {!isMyPage && (
        <p className="text-[16px] text-[#6282E1] mb-2 text-center">
          모아를 공유해서 친구끼리 큰 선물을 준비해봐요!
        </p>
      )}

      <div className="flex items-center gap-3 max-w-[350px] mx-auto">
        {!isMyPage && (
          <Button
            width="fixed"
            size="medium"
            onClick={handlePrimary}
            disabled={buttonStatus ? !buttonStatus.isEnabled : false}
            className="w-[288px] h-[50px] !font-normal text-white !bg-[#6282E1]"
            variant="primary"
          >
            {primaryLabel}
          </Button>
        )}

        {/* 공유 버튼은 그대로 */}
        <button
          className="w-[50px] h-[50px] flex items-center justify-center"
          aria-label="공유하기"
          onClick={onShareClick}
        >
          <img src={ShareButton} alt="공유 버튼" />
        </button>
      </div>
    </section>
  );
};

export default ParticipationActionBox;
