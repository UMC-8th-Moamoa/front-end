// src/pages/WishListRegisterPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WishListRegisterTopBar from "../../components/WishList/WishListRegisterTopBar";
import AutoInputSection from "../../components/WishList/AutoInputSection";
import ManualInputSection from "../../components/WishList/ManualInputSection";
import Button from "../../components/common/Button";

// 등록 API
import {
  createWishlistByUrl,
  createWishlistManual,
} from "../../services/wishlist/register";

// 수정 API
import { updateWishlist } from "../../services/wishlist/mutate";

// 업로드/분석 API (새 플로우)
import {
  createUserImagePresignedUrl,
  putToS3,
  verifyUpload,
  analyzeAndRegisterWishlistByImage,
  dataUrlToFile,
  extFromMime,
} from "../../services/wishlist/uploadimage";

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

  // 편집 모드 진입 시 전달될 수 있는 state
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

  /** 진입/종료 시 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /** 편집 모드 프리필 */
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

  /** 사진 선택 페이지에서 돌아온 state 처리 */
  useEffect(() => {
    const st = location.state as PhotoReturnState | undefined;
    if (st?.imageUrl) {
      if (st.targetTab === "manual") {
        setManualImageUrl(st.imageUrl);
        setSelectedTab("manual");
      } else {
        setAutoImageUrl(st.imageUrl);
        setSelectedTab("auto");
        setUrl(""); // 사진 선택 시 링크 입력 비움
      }
      // 히스토리 상태 정리
      navigate(location.pathname, { replace: true, state: isEdit ? edit : {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, location.pathname]);

  /** 자동 탭에서 URL을 입력하면 사진 미리보기는 초기화 */
  useEffect(() => {
    if (selectedTab === "auto" && url && autoImageUrl) {
      setAutoImageUrl(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /** 공통: dataURL 또는 http(s) URL을 받아 최종 업로드된 http URL을 반환 */
  const ensureUploadedUrl = async (src: string): Promise<string> => {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src; // 이미 URL

    // dataURL → File
    const file = dataUrlToFile(src, "wishlist-image");
    const mime = file.type || "image/jpeg";
    const fileName = `wishlist_${Date.now()}.${extFromMime(mime)}`;

    // 1) presigned
    const { uploadUrl, fileUrl } = await createUserImagePresignedUrl({
      fileName,
      fileType: mime,
    });

    // 2) PUT to S3
    await putToS3({ uploadUrl, file, fileType: mime });

    // 3) verify
    await verifyUpload(fileUrl);

    return fileUrl;
  };

  /** 제출 — 등록/수정 분기 */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const isPublic = !isPrivate;

      // ✅ 편집 모드: PATCH /wishlists/{id}
      if (isEdit && edit.item) {
        if (!name.trim()) {
          alert("제품명을 입력해 주세요");
          return;
        }
        const priceNumber = Number(price.replace(/[^0-9]/g, "")) || 0;

        // 편집 중 새로 고른 이미지가 dataURL이면 업로드
        let finalImageUrl = manualImageUrl ?? null;
        if (finalImageUrl && !/^https?:\/\//i.test(finalImageUrl) && finalImageUrl.startsWith("data:")) {
          finalImageUrl = await ensureUploadedUrl(finalImageUrl);
        }

        await updateWishlist(edit.item.id, {
          productName: name.trim(),
          price: priceNumber,
          productImageUrl: finalImageUrl,
          isPublic,
        });

        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "위시리스트가 수정되었습니다" },
        });
        return;
      }

      // ✅ 신규 등록
      if (selectedTab === "auto") {
        // 1) URL이 있으면 크롤링 등록
        if (url.trim()) {
          await createWishlistByUrl({ url: url.trim(), isPublic });
          navigate("/wishlist", {
            replace: true,
            state: { showToast: true, toastMsg: "위시리스트가 등록되었습니다" },
          });
          return;
        }

        // 2) URL이 없고 이미지가 있으면 업로드 → verify → analyze 등록
        if (!autoImageUrl) {
          alert("링크를 붙여넣거나 이미지를 선택해 주세요");
          return;
        }

        const uploadedUrl = await ensureUploadedUrl(autoImageUrl);

        // 4) 업로드된 URL로 AI 분석 + 자동 위시리스트 등록
        await analyzeAndRegisterWishlistByImage(uploadedUrl);

        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "위시리스트가 등록되었습니다" },
        });
        return;
      }

      // 수동 입력
      if (!name.trim()) {
        alert("제품명을 입력해 주세요");
        return;
      }
      const priceNumber = Number(price.replace(/[^0-9]/g, "")) || 0;

      // 수동 탭 이미지가 dataURL이면 먼저 업로드
      let manualUrlToSend: string | null = manualImageUrl ?? null;
      if (manualUrlToSend && !/^https?:\/\//i.test(manualUrlToSend) && manualUrlToSend.startsWith("data:")) {
        manualUrlToSend = await ensureUploadedUrl(manualUrlToSend);
      }

      await createWishlistManual({
        productName: name.trim(),
        price: priceNumber,
        imageUrl: manualUrlToSend,
        isPublic,
      });

      navigate("/wishlist", {
        replace: true,
        state: { showToast: true, toastMsg: "위시리스트가 등록되었습니다" },
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "요청에 실패했어요. 잠시 후 다시 시도해 주세요.";
      alert(msg);
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
