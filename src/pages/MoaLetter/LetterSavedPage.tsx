import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import DefaultImage from "../../assets/Lettersaved.svg";

export default function LetterSavedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // state에서 값 읽기
  const imageUrl = (location.state as any)?.imageUrl || DefaultImage;
  const receiverName = (location.state as any)?.receiverName || "수신자";

  return (
    <div className="w-[393px] h-screen mx-auto bg-white font-pretendard overflow-hidden flex flex-col items-center relative">
      <div className="flex flex-col pt-[82px] w-[350px]">
        {/* 저장된 이미지 or 기본 이미지 */}
        <div className="w-[349px] h-[337px] rounded-[20px] bg-[#F2F2F2] flex justify-center items-center overflow-hidden mb-[29px]">
          <img
            src={imageUrl}
            alt="저장된 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 타이틀 텍스트 */}
        <h2 className="text-[30px] font-bold text-[#1F1F1F] text-left leading-snug mb-[14px]">
          <span className="text-[#6282E1]">{receiverName}님</span>에게 전달할 편지를<br />
          저장했어요
        </h2>

        <p className="text-[19px] font-medium text-[#6C6C6C] text-left mb-[90px]">
          생일 전날까지 편지를 수정할 수 있어요!
        </p>

        <Button
          width="fixed"
          onClick={() => navigate("/home")}
          className="w-[350px] h-[50px] bg-[#6282E1] text-[#FFF] text-[20px] rounded-[10px] border-none shadow-none focus:outline-none"
        >
          <span style={{ fontWeight: 700 }}>확인</span>
        </Button>
      </div>
    </div>
  );
}
