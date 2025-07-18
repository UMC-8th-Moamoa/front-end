import { useNavigate } from "react-router-dom";
import BackButton from "../common/BackButton";
import CheckIcon from "../../assets/check.svg";

interface Props {
  onSave: () => void;
  
}

export default function LetterHeader({ onSave }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 pt-[20px] pb-[12px] relative">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* 가운데 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold leading-[22px] text-black font-pretendard">
        편지 작성하기
      </h1>

      {/* 체크 아이콘 */}
      <button
        onClick={() => {
          onSave();
          navigate("/moaletter/letter-saved");
        }}
        className="bg-transparent border-none p-0 m-0"  
      >
        <img src={CheckIcon} alt="check" className="w-[32px] h-[32px]" />
      </button>

    </div>
  );
}
