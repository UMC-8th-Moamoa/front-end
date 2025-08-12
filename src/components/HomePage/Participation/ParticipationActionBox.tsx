import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import ShareButton from "../../../assets/ShareButton.svg";

interface ParticipationActionBoxProps {
  isMyPage: boolean;
  participationStatus: "none" | "pending" | "confirmed";
  onClick?: () => void;
  onShareClick?: () => void; // 공유 버튼 클릭 시 실행할 콜백
}

const ParticipationActionBox = ({
  isMyPage,
  participationStatus,
  onClick,
  onShareClick,
}: ParticipationActionBoxProps) => {
  const navigate = useNavigate();

  const getButton = () => {
    switch (participationStatus) {
      case "none":
        return (
          <Button
            width="fixed"
            size="medium"
            onClick={() => navigate("/select-remittance")}
            className="text-white w-[288px] h-[50px] !font-normal !bg-[#6282E1]"
          >
            모아 참여하기
          </Button>
        );
      case "pending":
        return (
          <Button
            width="fixed"
            size="medium"
            variant="gray"
            disabled
            className="text-white w-[288px] h-[50px] !font-normal !bg-[#C7D5FF]"
          >
            송금 내역을 확인 중입니다
          </Button>
        );
      case "confirmed":
        return (
          <Button
            width="fixed"
            size="medium"
            onClick={onClick}
            className="text-white w-[288px] h-[50px] !font-normal !bg-[#6282E1]"
          >
            편지 작성하러 가기
          </Button>
        );
      default:
        return null;
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
        {!isMyPage && getButton()}
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
