import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LetterHeader from "../../components/moaletter/LetterHeader";
import Toolbar from "../../components/moaletter/Toolbar";
import FontItemList from "../../components/moaletter/FontItemList";
import LetterThemeList from "../../components/moaletter/LetterThemeList";
import LetterContent from "../../components/moaletter/LetterContent";
import EnvelopeContent, { type EnvelopeHandle } from "../../components/moaletter/EnvelopeContent";
import { createLetter, updateLetter, getLetterById } from "../../services/letters";

type ToolType = "none" | "keyboard" | "font" | "theme";

export default function WriteLetterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 새작성: { mode: 'create', birthdayEventId, receiverId }
  // 수정:   { mode: 'edit', letterId }
  const mode = location.state?.mode as "create" | "edit" | undefined;
  const editLetterId = location.state?.letterId as number | undefined;
  const birthdayEventId = (location.state?.birthdayEventId as number | undefined) ?? 0;
  const receiverId = (location.state?.receiverId as number | undefined) ?? 0;
  const senderId = 0;

  const [activeTab, setActiveTab] = useState<"letter" | "envelope">("letter");

  const [letterText, setLetterText] = useState("");
  const [letterPaperId, setLetterPaperId] = useState<number | null>(null);
  const [letterPaperImageUrl, setLetterPaperImageUrl] = useState<string | null>(null);

  const [envelopeId, setEnvelopeId] = useState<number | null>(null);
  const [envelopeImageUrl, setEnvelopeImageUrl] = useState<string | null>(null); // 중앙 사진(S3 URL로 치환 예정)
  const [envelopeStampUrl, setEnvelopeStampUrl] = useState<string | null>(null);

  const envelopeRef = useRef<EnvelopeHandle>(null);

  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontId, setFontId] = useState<number | null>(null);

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
    if (mode === "edit" && editLetterId) {
      (async () => {
        try {
          setLoading(true);
          const prev = await getLetterById(editLetterId);
          setLetterText(prev.content ?? "");
          setLetterPaperId(prev.letterPaperId ?? null);
          setEnvelopeId(prev.envelopeId ?? null);
          setEnvelopeImageUrl(prev.envelopeImageUrl ?? null);
          setFontId(prev.fontId ?? null);
          // prev로부터 paper 이미지나 stamp 이미지는 별도 API 없으면 생략(선택 시 즉시 반영됨)
        } catch {
          setSaveError("기존 편지 로드 실패");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [mode, editLetterId]);

  const handleSaveLetter = async () => {
    if (saving || letterText.trim().length === 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      let finalImageUrl = envelopeImageUrl ?? undefined;
      if (envelopeRef.current) {
        const url = await envelopeRef.current.finalizeCrop();
        if (url) finalImageUrl = url;
      }

      const safeLetterPaperId = letterPaperId ?? 0;
      const safeEnvelopeId = envelopeId ?? 0;
      const safeFontId = fontId ?? 0;

      if (mode === "edit" && editLetterId) {
        const saved = await updateLetter(editLetterId, {
          content: letterText,
          letterPaperId: safeLetterPaperId,
          envelopeId: safeEnvelopeId,
          fontId: safeFontId,
          envelopeImageUrl: finalImageUrl ?? "",
        });
        navigate("/moaletter/letter-saved", {
          state: { receiverName: "수신자", stampUrl: envelopeStampUrl },
        });
      } else {
        const saved = await createLetter({
          birthdayEventId,
          senderId,
          receiverId,
          content: letterText,
          letterPaperId: safeLetterPaperId,
          envelopeId: safeEnvelopeId,
          fontId: safeFontId,
          envelopeImageUrl: finalImageUrl ?? "",
        });
navigate("/moaletter/letter-saved", {
  state: {
    receiverName: "수신자",
    imageUrl: finalImageUrl ?? "",   // 200x200 크롭 결과(DataURL)
    stampUrl: envelopeStampUrl ?? "" // 우표도 같이
  },
});
      }
    } catch (err: any) {
      setSaveError(err?.response?.status === 401 ? "로그인이 필요합니다." : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyboardClick = () => {
    setActiveTool((prev) => (prev === "keyboard" ? "none" : "keyboard"));
    setTimeout(() => textareaRef.current?.focus(), 50);
  };
  const handleFontClick = () => setActiveTool((prev) => (prev === "font" ? "none" : "font"));
  const handleThemeClick = () => setActiveTool((prev) => (prev === "theme" ? "none" : "theme"));

  return (
    <div className="flex flex-col h-screen w-full max-w-[393px] mx-auto bg-white font-pretendard overflow-visible">
      <div className="sticky top-0 z-30 bg-white mb-[20px]">
        <LetterHeader onSave={handleSaveLetter} letterTextLength={letterText.length} />
      </div>

      {saveError && <div className="text-red-500 text-sm text-center my-2">{saveError}</div>}
      {saving && <div className="text-blue-500 text-sm text-center my-2">저장 중...</div>}
      {loading && <div className="text-gray-500 text-sm text-center my-2">불러오는 중...</div>}

      {/* 탭 */}
      <div className="flex flex-col items-center relative w-full">
        <div className="flex justify-center gap-[90px] w-[350px] z-10">
          <button onClick={() => { setActiveTab("letter"); setActiveTool("none"); }} className="w-[87px] pb-[0px] border-none bg-transparent">
            <span className={`text-center font-pretendard text-[16px] font-semibold ${activeTab === "letter" ? "text-[#6282E1]" : "text-[#C7D5FF]"}`} style={{ fontWeight: 600 }}>
              편지지
            </span>
          </button>
          <button onClick={() => { setActiveTab("envelope"); setActiveTool("none"); }} className="w-[87px] pb-[10px] border-none bg-transparent">
            <span className={`text-center font-pretendard text-[16px] font-semibold ${activeTab === "envelope" ? "text-[#6282E1]" : "text-[#C7D5FF]"}`} style={{ fontWeight: 600 }}>
              우표
            </span>
          </button>
        </div>
        <div className="absolute bottom-[-8px] w-[350px] h-[1px] bg-[#C7D5FF]" />
        <div className={`absolute bottom-[-8px] h-[3px] w-[175px] bg-[#6282E1] transition-all duration-300 ${activeTab === "letter" ? "left-[20px]" : "right-[20px]"}`} />
      </div>

      {/* 본문 */}
      {activeTab === "letter" ? (
        <LetterContent
          letterText={letterText}
          onChange={setLetterText}
          activeTool={activeTool}
          textareaRef={textareaRef}
          backgroundUrl={letterPaperImageUrl}    // 선택/기본 배경 반영
          fontFamily={fontFamily ?? undefined}   // 선택 폰트 반영
        />
      ) : (
        <EnvelopeContent
          ref={envelopeRef}
          selectedId={envelopeId ?? null}
          onSelect={(id, centerImageUrl, stampUrl) => {
            setEnvelopeId(id);
            if (centerImageUrl) setEnvelopeImageUrl(centerImageUrl); // 중앙 사진(DataURL) — 추후 업로드로 교체
            if (stampUrl) setEnvelopeStampUrl(stampUrl);             // 저장 확인 화면 오버레이용
          }}
        />
      )}

      {/* 툴바 */}
      {activeTab === "letter" && (
        <div className="z-30 bg-white w-full flex justify-center">
          <Toolbar
            activeTool={activeTool}
            onKeyboardClick={handleKeyboardClick}
            onFontClick={handleFontClick}
            onThemeClick={handleThemeClick}
          />
        </div>
      )}

      {/* 바텀시트 (폰트/편지지) */}
      {activeTab === "letter" && (activeTool === "font" || activeTool === "theme") && (
        <div className="z-20 bg-white px-[10px] py-[20px] pb-6 shadow-inner w-full overflow-x-hidden">
          <div className="max-h-[336px]">
            {activeTool === "font" && (
              <FontItemList
                selectedFontId={fontId ?? undefined}
                selectedFont={fontFamily ?? undefined}
                onSelect={({ id, family }) => {
                  setFontId(id);
                  setFontFamily(family ?? null);
                }}
              />
            )}
            {activeTool === "theme" && (
              <LetterThemeList
                selectedId={letterPaperId ?? undefined}
                onSelect={({ id, image }) => {
                  setLetterPaperId(id);
                  if (image) setLetterPaperImageUrl(image);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
