import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import DefaultImage from "../../assets/default.svg";

export default function LetterSavedPage() {
  const navigate = useNavigate();

  return (
    <div className="w-[393px] h-screen mx-auto bg-white font-pretendard overflow-hidden flex flex-col items-center relative">
      {/* 본문 전체 내용 */}
<div className="flex flex-col pt-[82px] w-[350px]">
        {/* 디폴트 이미지 */}
        <div className="w-[349px] h-[337px] rounded-[20px] bg-[#F2F2F2] flex justify-center items-center overflow-hidden mb-[29px]">
          <img
            src={DefaultImage}
            alt="기본 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 타이틀 텍스트 */}
        <h2 className="text-[30px] font-bold text-[#1F1F1F] text-left leading-snug mb-[14px]">
          <span className="text-[#6282E1]">채원님</span>에게 전달할 편지를<br />
          저장했어요
        </h2>

        {/* 설명 텍스트 */}
        <p className="text-[19px] font-medium text-[#6C6C6C] text-left mb-[90px]">
          생일 전날까지 편지를 수정할 수 있어요!
        </p>

        {/* 확인 버튼 */}
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
