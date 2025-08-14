import { useNavigate } from "react-router-dom";
import BackButton from "../common/BackButton";
import CheckIcon from "../../assets/check.svg";
import CheckGrayIcon from '../../assets/Check_gray.svg';

interface LetterHeaderProps {
  onSave: () => void | Promise<void>; // 비동기 허용
  letterTextLength: number;
  saving?: boolean; // 선택: 저장 중 비활성화

}

export default function LetterHeader({ onSave, letterTextLength, saving }: LetterHeaderProps) {


  return (
<div className="relative w-full h-[52px] mx-auto flex items-center justify-between px-4 pt-[20px]">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* 가운데 제목 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold leading-[22px] text-black font-pretendard">
        편지 작성하기
      </h1>

      {/* 체크 아이콘 */}
      <button
        onClick={() => { if (letterTextLength > 0 && !saving) onSave(); }}
        disabled={letterTextLength === 0 || !!saving}
        className="bg-transparent border-none p-0 m-0"
      >
        <img
          src={letterTextLength > 0 && !saving ? CheckIcon : CheckGrayIcon}
          alt="저장"
          className="w-[32px] h-[32px]"
        />
      </button>
    </div>
  );
}
