// src/pages/WishListRegisterPage.tsx
// (파일 전체 – 너가 올린 최신본에서 변경 포인트 표시)
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WishListRegisterTopBar from "../../components/WishList/WishListRegisterTopBar";
import AutoInputSection from "../../components/WishList/AutoInputSection";
import ManualInputSection from "../../components/WishList/ManualInputSection";
import Button from "../../components/common/Button";

import { createWishlistByUrl, createWishlistManual, updateWishlist } from "../../services/wishlist/list";
import { uploadWishlistImageAuto, dataURLtoFile, analyzeWishlistImage } from "../../services/wishlist/uploadimage";

type Tab = "auto" | "manual";

type EditState = {
  mode?: "edit";
  item?: { id: number; title: string; price: number; imageSrc?: string; isPublic: boolean };
};

type PhotoReturnState = {
  imageUrl?: string;
  targetTab?: Tab;
  returnTo?: string;
} & Partial<EditState>;

const WishListRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const edit = (location.state as EditState) || {};
  const [selectedTab, setSelectedTab] = useState<Tab>("auto");

  const [isPrivate, setIsPrivate] = useState(false);

  const [url, setUrl] = useState("");
  const [autoImageUrl, setAutoImageUrl] = useState<string | undefined>();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState<string | undefined>();

  const [submitting, setSubmitting] = useState(false);

  const isEdit = useMemo(() => edit.mode === "edit" && !!edit.item, [edit]);
  const editId = edit.item?.id;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

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

  useEffect(() => {
    const st = location.state as PhotoReturnState | undefined;
    if (st?.imageUrl) {
      if (st.targetTab === "manual") {
        setManualImageUrl(st.imageUrl);
        setSelectedTab("manual");
      } else {
        setAutoImageUrl(st.imageUrl);
        setSelectedTab("auto");
        setUrl(""); // 사진 선택 시 링크 비움(상호배타)
      }
      navigate(location.pathname, { replace: true, state: isEdit ? edit : {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, location.pathname]);

  useEffect(() => {
    if (selectedTab === "auto" && url) {
      if (autoImageUrl) setAutoImageUrl(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // ✅ 자동 탭: DataURL 이미지 오면 업로드→분석→필드 채움
  useEffect(() => {
    let running = false;
    const run = async () => {
      if (running) return;
      if (selectedTab !== "auto") return;
      if (!autoImageUrl?.startsWith("data:")) return;
      try {
        running = true;
        const file = dataURLtoFile(autoImageUrl);
        const publicUrl = await uploadWishlistImageAuto(file);   // presign → S3
        const analyzed = await analyzeWishlistImage(publicUrl);  // 분석
        if (!url && analyzed.result?.link) setUrl(analyzed.result.link);
        if (!name && analyzed.result?.title) setName(analyzed.result.title);
        if (!price && analyzed.result?.price) {
          const num = analyzed.result.price.replace(/[^\d]/g, "");
          if (num) setPrice(num);
        }
        setAutoImageUrl(publicUrl); // 미리보기는 공개 URL로 교체
      } catch (e) {
        console.warn("자동분석 실패:", e);
      }
    };
    run();
    return () => { running = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoImageUrl, selectedTab]);

  /** 링크 모달에서 '확인' 즉시 등록 (자동 입력 모드 전용) */
  const handleUrlSubmitNow = async (newUrl: string) => {
    if (!newUrl) return;
    const isPublic = !isPrivate;
    try {
      setSubmitting(true);
      await createWishlistByUrl(newUrl.trim(), isPublic);
      navigate("/wishlist", {
        replace: true,
        state: { showToast: true, toastMsg: "위시리스트가 등록되었습니다" },
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "URL 등록 실패";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const isPublic = !isPrivate;

      if (isEdit && editId && selectedTab === "manual") {
        if (!name.trim()) return alert("제품명을 입력해 주세요");
        const priceNumber = Number(price || 0);
        await updateWishlist(editId, {
          productName: name.trim(),
          price: priceNumber,
          isPublic,
        });
        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "위시리스트가 수정되었습니다" },
        });
        return;
      }

      if (selectedTab === "auto") {
        // 여기는 “버튼으로 등록” 케이스. (모달에서 이미 등록하면 도달 X)
        if (!url && !autoImageUrl) return alert("링크를 붙여넣거나 사진을 선택해 주세요");

        let finalUrl = url?.trim();
        if (!finalUrl && autoImageUrl?.startsWith("http")) {
          try {
            const analyzed = await analyzeWishlistImage(autoImageUrl);
            finalUrl = analyzed.result?.link?.trim() || "";
          } catch {}
        }
        if (!finalUrl) return alert("사진 분석에서 상품 링크를 찾지 못했어요. 링크를 직접 입력해 주세요.");

        await createWishlistByUrl(finalUrl, isPublic);
      } else {
        if (!name.trim()) return alert("제품명을 입력해 주세요");
        const priceNumber = Number(price || 0);

        let imageUrlForCreate: string | undefined = manualImageUrl;
        if (manualImageUrl?.startsWith("data:")) {
          const file = dataURLtoFile(manualImageUrl);
          imageUrlForCreate = await uploadWishlistImageAuto(file);
        }

        await createWishlistManual({
          productName: name.trim(),
          price: priceNumber,
          imageUrl: imageUrlForCreate,
          isPublic,
        });
      }

      navigate("/wishlist", {
        replace: true,
        state: { showToast: true, toastMsg: isEdit ? "위시리스트가 수정되었습니다" : "위시리스트가 등록되었습니다" },
      });
    } catch (e: any) {
      const reason =
        e?.response?.data?.error?.reason ||
        e?.response?.data?.message ||
        e?.message ||
        (isEdit ? "위시리스트 수정에 실패했습니다." : "위시리스트 등록에 실패했습니다.");
      alert(reason);
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
              onUrlSubmit={handleUrlSubmitNow}   // ✅ 모달 확인 즉시 등록
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
