// src/pages/WriteLetterPage.tsx
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
import { getMyNumericId } from "../../services/mypage";
import { getBirthdayEventDetail } from "../../services/user/event";
import { fetchUserItems } from "../../api/shopping";

type ToolType = "none" | "keyboard" | "font" | "theme";

/** -------------------- 유틸 -------------------- */
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

/** 숫자 ID 안전 로딩 */
const safeGetNumericId = (): number => {
  const raw = localStorage.getItem("my_numeric_id");
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** (옵션) 토큰에서 숫자 ID 백필 */
const tryDecodeJwtPayload = (token: string): any | null => {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};
const ensureNumericId = (): number | null => {
  const current = safeGetNumericId();
  if (current > 0) return current;

  const possibleKeys = ["accessToken", "ACCESS_TOKEN", "token", "jwt"];
  const access = possibleKeys.map((k) => localStorage.getItem(k)).find(Boolean);
  if (!access) return null;

  const p = tryDecodeJwtPayload(access!) || {};
  const candidates = [p.id, p.userId, p.uid, p.user_id, p.sub];
  const num = candidates.map((x) => Number(x)).find((v) => Number.isFinite(v) && v > 0);
  if (num) {
    localStorage.setItem("my_numeric_id", String(num));
    console.log("[BOOT] Backfilled my_numeric_id from JWT:", num);
    return num;
  }
  return null;
};

/** -------------------- 컴포넌트 -------------------- */
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

  /** ✅ senderId: my_numeric_id 기준으로 state 관리 */
  const [senderId, setSenderId] = useState<number>(() => safeGetNumericId());

  console.log("[DEBUG] WriteLetterPage Initializing...", { mode, editLetterId, birthdayEventId, senderId });

  const [activeTab, setActiveTab] = useState<"letter" | "envelope">("letter");
  const [letterText, setLetterText] = useState("");

  // ✅ 아래 3개는 모두 holditem_id (보관함 아이템 고유번호) 로만 관리한다.
  const [letterPaperId, setLetterPaperId] = useState<number | null>(null); // paper holditem_id
  const [envelopeId, setEnvelopeId] = useState<number | null>(null);       // seal  holditem_id (서버 기대치 불명 → 실패 시 보정)
  const [fontId, setFontId] = useState<number | null>(null);               // font  holditem_id

  const [letterPaperImageUrl, setLetterPaperImageUrl] = useState<string | null>(null);
  const [envelopeImageUrl, setEnvelopeImageUrl] = useState<string | null>(null);
  const [envelopeStampUrl, setEnvelopeStampUrl] = useState<string | null>(null);

  const envelopeRef = useRef<EnvelopeHandle>(null);

  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [receiverId, setReceiverId] = useState<number | null>(null);

  /** 🔁 마운트/포커스 복귀 시 senderId 보정 */
  useEffect(() => {
    const n1 = safeGetNumericId();
    if (n1 && n1 !== senderId) {
      setSenderId(n1);
      return;
    }
    const n2 = getMyNumericId() || 0;
    if (n2 && n2 !== senderId) {
      setSenderId(n2);
      return;
    }
    const n3 = ensureNumericId();
    if (n3 && n3 !== senderId) {
      setSenderId(n3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회만

  /** ✅ 우표(seal) 선택 콜백 (holditem_id로만 세팅) */
  const handleEnvelopeSelect = useCallback(
    (id: number | null, centerImageUrl?: string, stampUrl?: string) => {
      setEnvelopeId(id); // holditem_id
      if (centerImageUrl) setEnvelopeImageUrl(centerImageUrl); // dataURL일 수 있음 → 저장 시 업로드
      if (stampUrl) setEnvelopeStampUrl(stampUrl);             // 미리보기 용
    },
    []
  );

  useEffect(() => {
    const passedUrl = (memoizedState as any).imageUrl as string | undefined;
    const openTab = (memoizedState as any).openTab as "letter" | "envelope" | undefined;
    if (passedUrl) setEnvelopeImageUrl(passedUrl);
    if (openTab) setActiveTab(openTab);
  }, [memoizedState]);

  /** 🎯 이벤트 수신자 ID 조회 */
  useEffect(() => {
    const fetchReceiverId = async () => {
      if (birthdayEventId > 0) {
        console.log("[DEBUG] Fetching receiver ID for eventId:", birthdayEventId);
        try {
          setLoadingEvent(true);
          const eventDetail = await getBirthdayEventDetail(birthdayEventId);
          if (eventDetail.birthdayPerson?.id) {
            const receivedId = Number(eventDetail.birthdayPerson.id);
            console.log("[DEBUG] Fetched and setting Receiver ID:", receivedId);
            setReceiverId(receivedId);
          } else {
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
        console.warn("[DEBUG] birthdayEventId is 0, skipping fetchReceiverId.");
        setLoadingEvent(false);
      }
    };
    fetchReceiverId();
  }, [birthdayEventId]);

  /** ✏️ 수정 모드일 때 기존 편지 로드 (holditem_id 그대로 세팅) */
  useEffect(() => {
    if (mode === "edit" && editLetterId) {
      console.log("[DEBUG] Edit mode detected. Fetching letter with ID:", editLetterId);
      (async () => {
        try {
          setLoadingEvent(true);
          const prev = await getLetterById(editLetterId);
          console.log("[DEBUG] Fetched previous letter data:", prev);
          setLetterText(prev.content ?? "");
          setLetterPaperId(prev.letterPaperId ?? null); // holditem_id
          setEnvelopeId(prev.envelopeId ?? null);       // holditem_id (서버 의미 불명)
          setEnvelopeImageUrl(prev.envelopeImageUrl ?? null);
          setFontId(prev.fontId ?? null);               // holditem_id
        } catch {
          setSaveError("기존 편지 로드 실패");
        } finally {
          setLoadingEvent(false);
        }
      })();
    }
  }, [mode, editLetterId]);

  /** 💾 저장 */
  const handleSaveLetter = async () => {
    // 저장 직전 senderId 최종 보정
    if (!senderId || senderId <= 0) {
      const n = safeGetNumericId() || getMyNumericId() || ensureNumericId() || 0;
      if (n > 0) setSenderId(n);
    }

    console.log("[DEBUG] handleSaveLetter triggered. Current state:", {
      senderId,
      receiverId,
      birthdayEventId,
      letterTextLength: letterText.trim().length,
      letterPaperId,
      envelopeId,
      fontId,
    });

    // 0) 필수값 가드
    if (saving) return;
    if (letterText.trim().length === 0) {
      setSaveError("편지 내용을 입력해 주세요.");
      return;
    }
    if (!birthdayEventId || !receiverId || !senderId) {
      setSaveError("수신자, 발신자, 또는 이벤트 정보가 없습니다.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      // 1) 보유 검증 (holditem_id 기준 + 카테고리 분리)
      const mine = await fetchUserItems(500);
      const papers = mine.itemListEntry.filter(v => v.category === 'paper');
      const seals  = mine.itemListEntry.filter(v => v.category === 'seal');
      const fonts  = mine.itemListEntry.filter(v => v.category === 'font');

      const paperSet = new Set(papers.map(v => v.holditem_id));
      const sealSet  = new Set(seals.map(v => v.holditem_id));
      const fontSet  = new Set(fonts.map(v => v.holditem_id));

      console.log("[DEBUG] Owned(paper):", papers.map(v => ({hold:v.holditem_id, item:v.item_no, name:v.name})));
      console.log("[DEBUG] Owned(seal) :", seals.map(v => ({hold:v.holditem_id, item:v.item_no, name:v.name})));
      console.log("[DEBUG] Owned(font) :", fonts.map(v => ({hold:v.holditem_id, item:v.item_no, name:v.name})));
      console.log("[DEBUG] Selected    :", { letterPaperId, envelopeId, fontId });

      if (!letterPaperId || !paperSet.has(letterPaperId)) {
        console.error("❌ letterPaperId not owned or wrong category", { letterPaperId });
        setSaveError("편지봉투(종이)를 보유/선택해 주세요.");
        setSaving(false);
        return;
      }
      if (fontId && !fontSet.has(fontId)) {
        console.error("❌ fontId not a FONT holditem", { fontId });
        setSaveError("글씨체를 보유/선택해 주세요.");
        setSaving(false);
        return;
      }
      // envelopeId는 서버 기대치가 불명이라 1차는 seal 기준으로만 경고 로그
      if (envelopeId && !sealSet.has(envelopeId)) {
        console.warn("⚠ envelopeId is not a SEAL holditem (will still try):", { envelopeId });
      }

      // 2) 크롭 미확정 상태면 finalizeCrop 호출 → dataURL 반환 가능
      let finalImageUrl = envelopeImageUrl ?? undefined;
      if (envelopeRef.current) {
        const url = await envelopeRef.current.finalizeCrop();
        if (url) finalImageUrl = url; // dataURL 일 수 있음
      }

      // 3) dataURL이면 업로드 → URL 획득
      if (finalImageUrl?.startsWith("data:")) {
        try {
          finalImageUrl = await uploadDataUrlAndGetUrl(finalImageUrl);
        } catch (e) {
          console.error("[DEBUG] Center image upload failed:", e);
          // 업로드 실패 시 스탬프 이미지라도 사용(선택)
          if (envelopeStampUrl && !envelopeStampUrl.startsWith("data:")) {
            finalImageUrl = envelopeStampUrl;
          } else {
            finalImageUrl = ""; // 서버엔 dataURL 금지
          }
        }
      }
      if (!finalImageUrl && envelopeStampUrl) {
        // 센터 이미지가 없으면 스탬프 이미지라도 세팅(선택 정책)
        finalImageUrl = envelopeStampUrl;
      }

      // 4) 1차 페이로드(서버가 seal을 허용한다고 가정)
      const basePayload = {
        birthdayEventId: Number(birthdayEventId),
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        content: letterText,
        letterPaperId: Number(letterPaperId ?? 0),     // holditem_id (paper)
        envelopeId: Number(envelopeId ?? 0),           // holditem_id (seal?) - 불명
        fontId: Number(fontId ?? 0),                   // holditem_id (font)
        envelopeImageUrl: finalImageUrl ?? "",
      };
      console.log("[DEBUG] Payload#1 (stringified):", JSON.stringify(basePayload, null, 2));

      // 5) 호출 함수 (create/update 공용)
      const callSave = async (payload: typeof basePayload) => {
        if (mode === "edit" && editLetterId) {
          const updatePayload = {
            content: payload.content,
            letterPaperId: payload.letterPaperId,
            envelopeId: payload.envelopeId,
            fontId: payload.fontId,
            envelopeImageUrl: payload.envelopeImageUrl,
          };
          console.log("[DEBUG] Calling updateLetter with payload:", updatePayload);
          await updateLetter(editLetterId, updatePayload);
        } else {
          console.log("[DEBUG] Calling createLetter with payload:", payload);
          await createLetter(payload);
        }
      };

      // 6) 1차 시도
      try {
        await callSave(basePayload);
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        const data = err?.response?.data ?? err?.data;
        console.warn("[DEBUG] Save attempt #1 failed", { status, data });

        // 400 & "편지봉투" 메시지인 경우 → 서버가 envelopeId도 paper를 기대할 확률 높음
        const msg: string = data?.message || data?.error || data?.reason || "";
        const maybePaperExpected =
          status === 400 &&
          typeof msg === "string" &&
          /편지봉투|봉투|paper/i.test(msg);

        // 재시도 조건: envelopeId != letterPaperId 이고, letterPaperId가 유효한 paper일 때
        if (maybePaperExpected && letterPaperId && basePayload.envelopeId !== letterPaperId) {
          const payload2 = { ...basePayload, envelopeId: Number(letterPaperId) };
          console.log("[DEBUG] Payload#2 (fallback: envelopeId=letterPaperId):", JSON.stringify(payload2, null, 2));
          await callSave(payload2); // 재시도
        } else {
          throw err; // 그대로 상위에서 처리
        }
      }

      // 성공 시 이동
      navigate("/moaletter/letter-saved", {
        state: {
          receiverName: "수신자",
          imageUrl: finalImageUrl ?? "",
          stampUrl: envelopeStampUrl ?? "",
        },
      });
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      const data = err?.response?.data ?? err?.data;
      console.error("[LETTER_SAVE_ERROR]", { status, data });

      let msg: string = "저장 실패";
      if (data?.message) msg = data.message;
      else if (typeof data?.reason === "string") msg = data.reason;
      else if (typeof data?.error === "string") msg = data.error;
      else if (typeof data === "string") msg = data;
      else if (status === 401) msg = "로그인이 필요합니다.";

      try {
        setSaveError(String(msg));
      } catch {
        setSaveError("저장 실패");
      }
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

      {saveError && <div className="text-red-500 text-sm text-center my-2">{String(saveError)}</div>}
      {saving && <div className="text-blue-500 text-sm text-center my-2">저장 중...</div>}
      {loadingEvent && <div className="text-gray-500 text-sm text-center my-2">이벤트 정보 로딩 중...</div>}
      {!loadingEvent && !receiverId && (
        <div className="text-red-500 text-sm text-center my-2">수신자 정보가 없습니다.</div>
      )}

      <div className="flex flex-col items-center relative w-full">
        <div className="flex justify-center gap-[90px] w-[350px] z-10">
          <button
            onClick={() => {
              setActiveTab("letter");
              setActiveTool("none");
            }}
            className="w-[87px] pb-[0px] border-none bg-transparent"
          >
            <span
              className={`text-center font-pretendard text-[16px] font-semibold ${
                activeTab === "letter" ? "text-[#6282E1]" : "text-[#C7D5FF]"
              }`}
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
              className={`text-center font-pretendard text-[16px] font-semibold ${
                activeTab === "envelope" ? "text-[#6282E1]" : "text-[#C7D5FF]"
              }`}
              style={{ fontWeight: 600 }}
            >
              우표
            </span>
          </button>
        </div>
        <div className="absolute bottom-[-8px] w-[350px] h-[1px] bg-[#C7D5FF]" />
        <div
          className={`absolute bottom-[-8px] h-[3px] w-[175px] bg-[#6282E1] transition-all duration-300 ${
            activeTab === "letter" ? "left-[20px]" : "right-[20px]"
          }`}
        />
      </div>

      {loadingEvent || !receiverId ? null : (
        <>
          <div className="relative flex-1 w-full overflow-y-auto">
            <div
              className="absolute top-0 left-0 w-full h-full transition-opacity duration-300"
              style={{ display: activeTab === "letter" ? "block" : "none" }}
            >
              <LetterContent
                letterText={letterText}
                onChange={setLetterText}
                activeTool={activeTool}
                textareaRef={textareaRef}
                backgroundUrl={letterPaperImageUrl}
                fontFamily={fontFamily ?? undefined}
              />
            </div>
            <div
              className="absolute top-0 left-0 w-full h-full transition-opacity duration-300"
              style={{ display: activeTab === "envelope" ? "block" : "none" }}
            >
              <EnvelopeContent ref={envelopeRef} selectedId={envelopeId ?? null} onSelect={handleEnvelopeSelect} />
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
                        selectedFontId={fontId ?? undefined}          // holditem_id
                        selectedFont={fontFamily ?? undefined}
                        onSelect={({ id, family }) => {               // id는 holditem_id여야 함
                          setFontId(id);
                          setFontFamily(family ?? null);
                        }}
                      />
                    )}

                    {activeTool === "theme" && (
                      <LetterThemeList
                        selectedId={letterPaperId ?? undefined}       // holditem_id
                        onSelect={({ id, image }) => {                // id는 holditem_id여야 함
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
