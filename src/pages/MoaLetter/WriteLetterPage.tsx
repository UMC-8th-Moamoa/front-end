import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LetterHeader from "../../components/moaletter/LetterHeader";
import Toolbar from "../../components/moaletter/Toolbar";
import FontItemList from "../../components/moaletter/FontItemList";
import LetterThemeList from "../../components/moaletter/LetterThemeList";
import LetterContent from "../../components/moaletter/LetterContent";
import EnvelopeContent, { type EnvelopeHandle } from "../../components/moaletter/EnvelopeContent";
import { createLetter, updateLetter, getLetterById } from "../../services/letters";
import { uploadEnvelopeImage, dataURLtoBlob } from "../../services/envelope";
import { getMyUserId, getMyNumericId } from "../../services/mypage"; 
import { getBirthdayEventDetail } from "../../services/user/event";

type ToolType = "none" | "keyboard" | "font" | "theme";

function dataURLtoFile(dataUrl: string, fileName = "envelope-center.png"): File {
  const [meta, b64] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || "image/png";
  const bin = atob(b64);
  const len = bin.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
  return new File([u8], fileName, { type: mime });
}

async function uploadDataUrlAndGetUrl(dataUrl: string): Promise<string> {
  const blob = dataURLtoBlob(dataUrl, "image/jpeg");
  const { fileUrl } = await uploadEnvelopeImage(blob, `envelope-crop-${Date.now()}.jpeg`);
  return fileUrl;
}

export default function WriteLetterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const memoizedState = useMemo(() => location.state || {}, [location.state]);

  const mode = memoizedState.mode as "create" | "edit" | undefined;
  const editLetterId = memoizedState.letterId as number | undefined;

  const query = new URLSearchParams(location.search);
  const birthdayEventIdFromQuery = Number(query.get("eventId")) || 0;
  const birthdayEventId =
    Number((memoizedState as any).birthdayEventId ?? birthdayEventIdFromQuery) || 0;

  // ==================== SOLUTION ====================
  // CHANGED: getMyUserId() 대신 getMyNumericId()를 사용합니다.
  const senderId = getMyNumericId() || 0;
  // ================================================
  // DEBUG LOG ADDED: 컴포넌트 초기화 시점의 ID 상태 확인
  console.log(
    "[DEBUG] WriteLetterPage Initializing...",
    { mode, editLetterId, birthdayEventId, senderId }
  );

  const [activeTab, setActiveTab] = useState<"letter" | "envelope">("letter");
  const [letterText, setLetterText] = useState("");
  const [letterPaperId, setLetterPaperId] = useState<number | null>(null);
  const [letterPaperImageUrl, setLetterPaperImageUrl] = useState<string | null>(null);
  const [envelopeId, setEnvelopeId] = useState<number | null>(null);
  const [envelopeImageUrl, setEnvelopeImageUrl] = useState<string | null>(null);
  const [envelopeStampUrl, setEnvelopeStampUrl] = useState<string | null>(null);
  const envelopeRef = useRef<EnvelopeHandle>(null);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontId, setFontId] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [receiverId, setReceiverId] = useState<number | null>(null);

  const handleEnvelopeSelect = useCallback(
    (id: number | null, centerImageUrl?: string, stampUrl?: string) => {
      setEnvelopeId(id);
      if (centerImageUrl) setEnvelopeImageUrl(centerImageUrl);
      if (stampUrl) setEnvelopeStampUrl(stampUrl);
    },
    []
  );

  useEffect(() => {
    const passedUrl = (memoizedState as any).imageUrl as string | undefined;
    const openTab = (memoizedState as any).openTab as "letter" | "envelope" | undefined;
    if (passedUrl) setEnvelopeImageUrl(passedUrl);
    if (openTab) setActiveTab(openTab);
  }, [memoizedState]);

  useEffect(() => {
    const fetchReceiverId = async () => {
      if (birthdayEventId > 0) {
        // DEBUG LOG ADDED: 수신자 ID 조회 시작 시점의 이벤트 ID 확인
        console.log("[DEBUG] Fetching receiver ID for eventId:", birthdayEventId);
        try {
          setLoadingEvent(true);
          const eventDetail = await getBirthdayEventDetail(birthdayEventId);
          if (eventDetail.birthdayPerson?.id) {
            const receivedId = Number(eventDetail.birthdayPerson.id);
            // DEBUG LOG ADDED: API로부터 받은 수신자 ID 확인
            console.log("[DEBUG] Fetched and setting Receiver ID:", receivedId);
            setReceiverId(receivedId);
          } else {
            // DEBUG LOG ADDED: API 응답에 수신자 ID가 없을 경우
            console.warn("[DEBUG] Receiver ID not found in event detail response.");
            setSaveError("수신자 ID를 찾을 수 없습니다.");
          }
        } catch (e) {
          console.error("[DEBUG] Failed to fetch event info:", e);
          setSaveError("이벤트 정보를 불러오는 데 실패했습니다.");
        } finally {
          setLoadingEvent(false);
        }
      } else {
        // DEBUG LOG ADDED: 이벤트 ID가 없어 수신자 조회를 건너뛸 경우
        console.warn("[DEBUG] birthdayEventId is 0, skipping fetchReceiverId.");
        setLoadingEvent(false);
      }
    };
    fetchReceiverId();
  }, [birthdayEventId]);

  useEffect(() => {
    if (mode === "edit" && editLetterId) {
       // DEBUG LOG ADDED: 수정 모드 진입 시 ID 확인
       console.log("[DEBUG] Edit mode detected. Fetching letter with ID:", editLetterId);
      (async () => {
        try {
          setLoadingEvent(true);
          const prev = await getLetterById(editLetterId);
          // DEBUG LOG ADDED: 불러온 편지 데이터 확인
          console.log("[DEBUG] Fetched previous letter data:", prev);
          setLetterText(prev.content ?? "");
          setLetterPaperId(prev.letterPaperId ?? null);
          setEnvelopeId(prev.envelopeId ?? null);
          setEnvelopeImageUrl(prev.envelopeImageUrl ?? null);
          setFontId(prev.fontId ?? null);
        } catch {
          setSaveError("기존 편지 로드 실패");
        } finally {
          setLoadingEvent(false);
        }
      })();
    }
  }, [mode, editLetterId]);

  const handleSaveLetter = async () => {
    // DEBUG LOG ADDED: 저장 버튼 클릭 시점의 모든 ID 상태 확인 (가장 중요)
    console.log(
      "[DEBUG] handleSaveLetter triggered. Current state:",
      { senderId, receiverId, birthdayEventId, letterTextLength: letterText.trim().length }
    );

    if (saving || letterText.trim().length === 0 || !birthdayEventId || !receiverId || !senderId) {
      // DEBUG LOG ADDED: 저장 조건 실패 시 원인 파악
      console.error("[DEBUG] Save validation failed.", {
        isTextEmpty: letterText.trim().length === 0,
        isBirthdayEventIdInvalid: !birthdayEventId,
        isReceiverIdInvalid: !receiverId,
        isSenderIdInvalid: !senderId,
      });
      if (!birthdayEventId || !receiverId || !senderId) {
        setSaveError("수신자, 발신자, 또는 이벤트 정보가 없습니다.");
      }
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      let finalImageUrl = envelopeImageUrl ?? undefined;
      if (envelopeRef.current) {
        const url = await envelopeRef.current.finalizeCrop();
        if (url) finalImageUrl = url;
      }
      if (finalImageUrl?.startsWith("data:")) {
        finalImageUrl = await uploadDataUrlAndGetUrl(finalImageUrl);
      }
      if (!finalImageUrl && envelopeStampUrl) {
        finalImageUrl = envelopeStampUrl;
      }

      const safeLetterPaperId = letterPaperId ?? 0;
      const safeEnvelopeId = envelopeId ?? 0;
      const safeFontId = fontId ?? 0;

      if (mode === "edit" && editLetterId) {
        const updatePayload = {
          content: letterText,
          letterPaperId: safeLetterPaperId,
          envelopeId: safeEnvelopeId,
          fontId: safeFontId,
          envelopeImageUrl: finalImageUrl ?? "",
        };
        // DEBUG LOG ADDED: 편지 업데이트 직전 데이터 확인
        console.log("[DEBUG] Calling updateLetter with payload:", updatePayload);
        await updateLetter(editLetterId, updatePayload);
        navigate("/moaletter/letter-saved", { state: { receiverName: "수신자", stampUrl: envelopeStampUrl } });
      } else {
        const createPayload = {
          birthdayEventId: Number(birthdayEventId),
          senderId: senderId,
          receiverId: Number(receiverId),
          content: letterText,
          letterPaperId: Number(safeLetterPaperId),
          envelopeId: Number(safeEnvelopeId),
          fontId: Number(safeFontId),
          envelopeImageUrl: finalImageUrl ?? "",
        };
        // DEBUG LOG ADDED: 편지 생성 직전 데이터 확인
        console.log("[DEBUG] Calling createLetter with payload:", createPayload);
        await createLetter(createPayload);
        navigate("/moaletter/letter-saved", {
          state: {
            receiverName: "수신자",
            imageUrl: finalImageUrl ?? "",
            stampUrl: envelopeStampUrl ?? "",
          },
        });
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("[LETTER_SAVE_ERROR]", { status, data });

      let msg: string = "저장 실패";
      if (typeof data?.reason === "string") msg = data.reason;
      else if (typeof data?.error === "string") msg = data.error;
      else if (typeof data === "string") msg = data;
      else if (status === 401) msg = "로그인이 필요합니다.";

      if (typeof msg !== "string") {
        try { msg = JSON.stringify(msg); } catch { msg = "저장 실패"; }
      }
      setSaveError(msg);
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

      {/* ✅ 객체가 들어와도 문자열로 안전 렌더링 */}
      {saveError && <div className="text-red-500 text-sm text-center my-2">{String(saveError)}</div>}
      {saving && <div className="text-blue-500 text-sm text-center my-2">저장 중...</div>}
      {loadingEvent && <div className="text-gray-500 text-sm text-center my-2">이벤트 정보 로딩 중...</div>}
      {!loadingEvent && !receiverId && (
        <div className="text-red-500 text-sm text-center my-2">수신자 정보가 없습니다.</div>
      )}

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

      {loadingEvent || !receiverId ? null : (
        <>
          <div className="relative flex-1 w-full overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300" style={{ display: activeTab === "letter" ? "block" : "none" }}>
              <LetterContent
                letterText={letterText}
                onChange={setLetterText}
                activeTool={activeTool}
                textareaRef={textareaRef}
                backgroundUrl={letterPaperImageUrl}
                fontFamily={fontFamily ?? undefined}
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300" style={{ display: activeTab === "envelope" ? "block" : "none" }}>
              <EnvelopeContent
                ref={envelopeRef}
                selectedId={envelopeId ?? null}
                onSelect={handleEnvelopeSelect}
              />
            </div>
          </div>

          {activeTab === "letter" && (
            <div className="z-30 bg-white w-full flex flex-col items-center">
              <Toolbar
                activeTool={activeTool}
                onKeyboardClick={handleKeyboardClick}
                onFontClick={handleFontClick}
                onThemeClick={handleThemeClick}
              />

              {(activeTool === "font" || activeTool === "theme") && (
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
          )}
        </>
      )}
    </div>
  );
}