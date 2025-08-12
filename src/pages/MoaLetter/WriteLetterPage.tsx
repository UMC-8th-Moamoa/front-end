import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LetterHeader from "../../components/moaletter/LetterHeader";
import Toolbar from "../../components/moaletter/Toolbar";
import FontItemList from "../../components/moaletter/FontItemList";
import LetterThemeList from "../../components/moaletter/LetterThemeList";
import LetterContent from "../../components/moaletter/LetterContent";
import EnvelopeContent, { type EnvelopeHandle } from "../../components/moaletter/EnvelopeContent";
import { createLetter, updateLetter, getLetterById } from "../../api/letters"; // ← 편지 등록 API 래퍼


type ToolType = "none" | "keyboard" | "font" | "theme";

export default function WriteLetterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 홈에서 넘겨줄 것:
  // 새작성: { mode: 'create', birthdayEventId, receiverId }
  // 수정:   { mode: 'edit', letterId }

  const mode = location.state?.mode as 'create' | 'edit' | undefined;
  const editLetterId = location.state?.letterId as number | undefined;
  const birthdayEventId = (location.state?.birthdayEventId as number | undefined) ?? 12; // 임시
  const receiverId = (location.state?.receiverId as number | undefined) ?? 7;            // 임시
  const senderId = 5; // TODO: 로그인 사용자 ID로 교체

  const [activeTab, setActiveTab] = useState<"letter" | "envelope">("letter");
  const [letterText, setLetterText] = useState("");
  const [letterPaperId, setLetterPaperId] = useState<number | null>(3);
  const [envelopeId, setEnvelopeId] = useState<number | null>(8);
  const [envelopeImageUrl, setEnvelopeImageUrl] = useState<string | null>(null);
  const envelopeRef = useRef<EnvelopeHandle>(null);
  const [fontFamily, setFontFamily] = useState<string | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (location.state?.openTab === "envelope") setActiveTab("envelope");
  }, [location.state]);

  // 수정 모드 프리필
  useEffect(() => {
    if (mode === 'edit' && editLetterId) {
      (async () => {
        try {
          setLoading(true);
          const prev = await getLetterById(editLetterId);
          setLetterText(prev.content ?? "");
          setLetterPaperId(prev.letterPaperId ?? null);
          setEnvelopeId(prev.envelopeId ?? null);
          setEnvelopeImageUrl(prev.envelopeImageUrl ?? null);
        } catch {
          setSaveError("기존 편지 로드 실패");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [mode, editLetterId]);



  const handleSaveLetter = async () => {
    if (saving || letterText.length === 0) return;
    setSaving(true); setSaveError(null);
    try {
      let finalImageUrl = envelopeImageUrl ?? undefined;
      if (envelopeRef.current) {
        const url = await envelopeRef.current.finalizeCrop();
        if (url) finalImageUrl = url;
      }

      if (mode === 'edit' && editLetterId) {
        const saved = await updateLetter(editLetterId, {
          content: letterText,
          letterPaperId: letterPaperId ?? undefined,
          envelopeId: envelopeId ?? undefined,
          envelopeImageUrl: finalImageUrl,
        });
        navigate(`/moaletter/letters/${saved.id}`);
      } else {
        const saved = await createLetter({
          birthdayEventId,
          senderId,
          receiverId,
          content: letterText,
          letterPaperId: letterPaperId ?? 0,
          envelopeId: envelopeId ?? 0,
          envelopeImageUrl: finalImageUrl,
        });
        navigate(`/moaletter/letters/${saved.id}`);
      }
    } catch (err: any) {
      setSaveError(err?.response?.status === 401 ? "로그인이 필요합니다." : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  // 체크버튼 누를 때만 저장: LetterHeader가 이미 onSave만 호출
  // 테마/우표 선택 시 setter를 내려준다.

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
    <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard overflow-visible">
      <div className="sticky top-0 z-30 bg-white mb-[20px]">
        <LetterHeader onSave={handleSaveLetter} letterTextLength={letterText.length} saving={saving} />
      </div>

      {saveError && <div className="text-red-500 text-sm text-center my-2">{saveError}</div>}
      {saving && <div className="text-blue-500 text-sm text-center my-2">저장 중...</div>}
      {loading && <div className="text-gray-500 text-sm text-center my-2">불러오는 중...</div>}



      {/* 탭 메뉴 */}
      {/* LetterContent / LetterThemeList / EnvelopeContent 내부에서 선택 변경 시 아래 setter를 사용하도록 props 추가 필요 */}
      {/* 예: <LetterThemeList onSelect={(id)=>setLetterPaperId(id)} /> */}
      {/* 예: <EnvelopeContent onSelectStamp={(id,url)=>{setEnvelopeId(id); setEnvelopeImageUrl(url)}} /> */}

      <div className="flex flex-col items-center  relative w-full">
        <div className="flex justify-center gap-[90px] w-[350px] z-10">
          <button
            onClick={() => {
              setActiveTab("letter");
              setActiveTool("none");
            }}
            className="w-[87px] pb-[0px] border-none bg-transparent"
          >
            <span
              className={`
        text-center font-pretendard text-[16px] font-semibold
        ${activeTab === "letter" ? "text-[#6282E1]" : "text-[#C7D5FF]"}
      `}
              style={{ fontWeight: 600 }}
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
              style={{ fontWeight: 600 }}
            >
              우표
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


      {/* 본문 */}
      {activeTab === "letter" ? (
        <LetterContent
          letterText={letterText}
          onChange={setLetterText}
          activeTool={activeTool}
          textareaRef={textareaRef}
        // 필요 시 textarea에 fontFamily 적용
        // styleOverride={{ fontFamily: fontFamily ?? undefined }}
        />
      ) : (
        <EnvelopeContent
          ref={envelopeRef}
          selectedId={envelopeId ?? null}
          onSelect={(id, url) => {
            setEnvelopeId(id);
            if (url) setEnvelopeImageUrl(url);
          }}
        />
      )}
    </div> 
  )
      {/* 툴바: 입력창 아래에 고정 + 중앙 정렬 */ }
  {
    activeTab === "letter" && (
      <div className="z-30 bg-white w-full flex justify-center">
        <Toolbar
          activeTool={activeTool}
          onKeyboardClick={handleKeyboardClick}
          onFontClick={handleFontClick}
          onThemeClick={handleThemeClick}
        />
      </div>
    )
  }

  {/* 바텀시트 */ }
  {
    activeTab === "letter" && (activeTool === "font" || activeTool === "theme") && (
      <div className="z-20 bg-white px-[10px] py-[20px] pb-6 shadow-inner w-full overflow-x-hidden">
        <div className="max-h-[336px]">
          {activeTool === "font" && (
            <FontItemList
              selectedFont={fontFamily ?? undefined}
              onSelect={(f) => setFontFamily(f)}
            />
          )}
          {activeTool === "theme" && (
            <LetterThemeList
              selectedId={letterPaperId ?? undefined}
              onSelect={(id) => setLetterPaperId(id)}
            />
          )}
        </div>
      </div>
    )
  }
}

