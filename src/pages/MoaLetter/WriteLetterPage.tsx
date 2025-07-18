import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LetterHeader from "../../components/moaletter/LetterHeader";
import Toolbar from "../../components/moaletter/Toolbar";
import FontItemList from "../../components/moaletter/FontItemList";
import LetterThemeList from "../../components/moaletter/LetterThemeList";
import LetterContent from "../../components/moaletter/LetterContent";
import EnvelopeContent from "../../components/moaletter/EnvelopeContent";

type ToolType = "none" | "keyboard" | "font" | "theme";

export default function WriteLetterPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"letter" | "envelope">("letter");
  const [letterText, setLetterText] = useState("");
  const [activeTool, setActiveTool] = useState<ToolType>("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyboardClick = () => {
    setActiveTool((prev) => (prev === "keyboard" ? "none" : "keyboard"));
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleFontClick = () => {
    setActiveTool((prev) => (prev === "font" ? "none" : "font"));
  };

  const handleThemeClick = () => {
    setActiveTool((prev) => (prev === "theme" ? "none" : "theme"));
  };

  return (
    <div className="flex flex-col h-screen max-w-[393px] w-full mx-auto bg-white font-pretendard overflow-hidden">
      {/* 상단 헤더 */}
      <LetterHeader
        onSave={() => {
          localStorage.setItem("moa_letter", letterText);
          navigate("/moaletter/letter-saved");
        }}
      />

{/* 탭 메뉴 */}
<div className="flex flex-col items-center mt-[30px] relative w-full">
  <div className="flex justify-center gap-[90px] w-[350px] z-10">
    <button
      onClick={() => {
        setActiveTab("letter");
        setActiveTool("none");
      }}
      className="w-[87px] pb-[10px] border-none bg-transparent"
    >
    <span
      className={`
        text-center font-pretendard text-[16px] font-semibold
        ${activeTab === "letter" ? "text-[#6282E1]" : "text-[#C7D5FF]"}
      `}
    >
        편지지
      </span>
    </button>

    <button
      onClick={() => {
        setActiveTab("envelope");
        setActiveTool("none");
      }}
      className="w-[87px] pb-[10px] border-none bg-transparent"
    >
    <span
      className={`
        text-center font-pretendard text-[16px] font-semibold
        ${activeTab === "envelope" ? "text-[#6282E1]" : "text-[#C7D5FF]"}
      `}
    >
        편지봉투
      </span>
    </button>
  </div>

  {/* 연한 전체 밑줄 (글씨 아래 16px) */}
  <div className="absolute bottom-[-8px] w-[350px] h-[1px] bg-[#C7D5FF]" />

  {/* 진한 강조 밑줄 (선택된 탭 기준으로 175px) */}
  <div
    className={`
      absolute bottom-[-8px] h-[3px] w-[175px] bg-[#6282E1] transition-all duration-300
      ${activeTab === "letter" ? "left-[20px]" : "right-[20px]"}
    `}
  />
</div>


      {/* 본문 내용 */}
      <div className="flex-1 overflow-y-auto w-full">
        {activeTab === "letter" ? (
          <LetterContent
            letterText={letterText}
            onChange={setLetterText}
            activeTool={activeTool}
            textareaRef={textareaRef}
          />
        ) : (
          <EnvelopeContent />
        )}
      </div>

      {/* 툴바: 입력창 아래에 고정 + 중앙 정렬 */}
      {activeTab === "letter" && (
        <div className="z-30 px-4 pt-2 bg-white w-full overflow-x-hidden flex justify-center">
          <Toolbar
            activeTool={activeTool}
            onKeyboardClick={handleKeyboardClick}
            onFontClick={handleFontClick}
            onThemeClick={handleThemeClick}
          />
        </div>
      )}

      {/* 아이템 리스트: 툴바 아래에 붙고 자체 스크롤 */}
      {activeTab === "letter" &&
        (activeTool === "font" || activeTool === "theme") && (
          <div className="z-20 bg-white px-4 pb-6 shadow-inner w-full overflow-x-hidden">
            <div className="max-h-[250px]">
              {activeTool === "font" && <FontItemList />}
              {activeTool === "theme" && <LetterThemeList />}
            </div>
          </div>
        )}
    </div>
  );
}
