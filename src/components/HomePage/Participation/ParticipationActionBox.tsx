// src/components/HomePage/Participation/ParticipationActionBox.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import ShareButton from "../../../assets/ShareButton.svg";
import type { EventButtonStatus } from "../../../services/user/event";

interface ParticipationActionBoxProps {
  isMyPage: boolean;
  /** 서버에서 내려온 버튼 상태 전체 전달 */
  buttonStatus: EventButtonStatus;
  /** WRITE/EDIT 등 2차 액션이 페이지마다 다르면 주입 */
  onPrimaryClick?: () => void;
  onShareClick?: () => void;
  /** 라우트 커스터마이즈가 필요하면 오버라이드 */
  actionRoutes?: {
    participate?: string;   // 기본: "/select-remittance"
    writeLetter?: string;   // 기본: "/moaletter/write"
    editLetter?: string;    // 기본: "/moaletter/edit"
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

  const routes = useMemo(
    () => ({
      participate: actionRoutes?.participate ?? "/select-remittance",
      writeLetter: actionRoutes?.writeLetter ?? "/moaletter/write",
      editLetter: actionRoutes?.editLetter ?? "/moaletter/edit",
    }),
    [actionRoutes]
  );

  const handlePrimary = () => {
    if (!buttonStatus.isEnabled) return;

    switch (buttonStatus.buttonAction) {
      case "PARTICIPATE":
        navigate(routes.participate);
        break;
      case "WRITE_LETTER":
        if (onPrimaryClick) onPrimaryClick();
        else navigate(routes.writeLetter);
        break;
      case "EDIT_LETTER":
        if (onPrimaryClick) onPrimaryClick();
        else navigate(routes.editLetter);
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
            disabled={!buttonStatus.isEnabled}
            className={[
              "w-[288px] h-[50px] !font-normal text-white",
              buttonStatus.isEnabled ? "!bg-[#6282E1]" : "!bg-[#C7D5FF]",
            ].join(" ")}
            variant={buttonStatus.isEnabled ? "primary" : "gray"}
          >
            {buttonStatus.buttonText}
          </Button>
        )}

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
