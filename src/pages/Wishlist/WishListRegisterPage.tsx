// src/pages/WishListRegisterPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WishListRegisterTopBar from "../../components/WishList/WishListRegisterTopBar";
import AutoInputSection from "../../components/WishList/AutoInputSection";
import ManualInputSection from "../../components/WishList/ManualInputSection";
import Button from "../../components/common/Button";

type Tab = "auto" | "manual";

type EditState = {
  mode?: "edit";
  item?: { id: number; title: string; price: number; imageSrc?: string; isPublic: boolean };
};

type PhotoReturnState = {
  imageUrl?: string;   // DataURL or http URL (미리보기용)
  targetTab?: Tab;
  returnTo?: string;
} & Partial<EditState>;

const WishListRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 편집 모드 진입 시 전달될 수 있는 state (UI만 유지)
  const edit = (location.state as EditState) || {};
  const isEdit = useMemo(() => edit.mode === "edit" && !!edit.item, [edit]);

  // 탭
  const [selectedTab, setSelectedTab] = useState<Tab>("auto");

  // 공개/비공개 (체크되면 비공개)
  const [isPrivate, setIsPrivate] = useState(false);

  // 자동 입력 탭
  const [url, setUrl] = useState("");
  const [autoImageUrl, setAutoImageUrl] = useState<string | undefined>();

  // 수동 입력 탭
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState<string | undefined>();

  // 제출 중 UI
  const [submitting, setSubmitting] = useState(false);

  /** 진입/종료 시 스크롤 잠금 (UI 유지용) */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  /** 편집 모드 프리필 (네트워크 없음) */
  useEffect(() => {
    if (isEdit && edit.item) {
      setSelectedTab("manual");
      setName(edit.item.title ?? "");
      setPrice(String(edit.item.price ?? 0));
      setIsPrivate(!edit.item.isPublic);
      setManualImageUrl(edit.item.imageSrc ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  /** 사진 선택 페이지에서 돌아온 state 처리 (네비게이션 상태만 사용) */
  useEffect(() => {
    const st = location.state as PhotoReturnState | undefined;
    if (st?.imageUrl) {
      if (st.targetTab === "manual") {
        setManualImageUrl(st.imageUrl);
        setSelectedTab("manual");
      } else {
        setAutoImageUrl(st.imageUrl);
        setSelectedTab("auto");
        setUrl(""); // 사진 선택 시 링크 입력은 비움
      }
      // 히스토리 상태 정리
      navigate(location.pathname, { replace: true, state: isEdit ? edit : {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, location.pathname]);

  /** 자동 탭에서 URL을 입력하면 사진 미리보기는 초기화 (UI 정합성) */
  useEffect(() => {
    if (selectedTab === "auto" && url && autoImageUrl) {
      setAutoImageUrl(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /** URL 모달의 "확인" 액션 — 네트워크 제거, 상태만 반영 */
  const handleUrlSubmitNow = (newUrl: string) => {
    setUrl(newUrl.trim());
    alert("링크가 입력되었습니다. (데모 모드: API 미연결)");
  };

  /** 제출 버튼 — 네트워크 제거, 기본 입력값 검증 후 안내만 */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (isEdit && selectedTab === "manual") {
        if (!name.trim()) return alert("제품명을 입력해 주세요");
        // 데모: 네비게이션만 수행
        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "수정 화면 데모 완료 (API 미연결)" },
        });
        return;
      }

      if (selectedTab === "auto") {
        if (!url && !autoImageUrl) {
          alert("링크를 붙여넣거나 사진을 선택해 주세요");
          return;
        }
        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "자동 입력 데모 완료 (API 미연결)" },
        });
      } else {
        if (!name.trim()) return alert("제품명을 입력해 주세요");
        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "수동 입력 데모 완료 (API 미연결)" },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-white flex justify-center overflow-hidden">
      <div className="w-full max-w-[393px] h-full flex flex-col relative overflow-hidden">
        <WishListRegisterTopBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

        <div className="flex-grow px-4 pt-4 pb-[130px] overflow-hidden">
          {selectedTab === "auto" && (
            <AutoInputSection
              url={url}
              onUrlChange={(v) => setUrl(v)}
              imageUrl={autoImageUrl}
              onUrlSubmit={handleUrlSubmitNow}  // 더미 동작
            />
          )}

          {selectedTab === "manual" && (
            <ManualInputSection
              name={name}
              price={price}
              onNameChange={setName}
              onPriceChange={setPrice}
              imageUrl={manualImageUrl}
            />
          )}
        </div>

        <div className="w-full max-w-[393px] px-4 absolute bottom-[35px] z-20 bg-white">
          <div className="flex flex-col gap-2 py-3">
            <label className="flex items-center space-x-2 ml-3 mb-1 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                className="w-4 h-4 accent-gray-400"
              />
              <span>{isPrivate ? "비공개" : "공개"}</span>
            </label>

            <Button
              variant="primary"
              size="medium"
              width="full"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-[50px] mx-auto text-[20px] !bg-[#6282E1] font-semibold"
            >
              {submitting ? (isEdit ? "수정 중..." : "등록 중...") : isEdit ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WishListRegisterPage;
