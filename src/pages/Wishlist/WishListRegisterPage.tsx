// src/pages/WishListRegisterPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WishListRegisterTopBar from "../../components/WishList/WishListRegisterTopBar";
import AutoInputSection from "../../components/WishList/AutoInputSection";
import ManualInputSection from "../../components/WishList/ManualInputSection";
import Button from "../../components/common/Button";
import {
  createWishlistByUrl,
  createWishlistManual,
  updateWishlist,
} from "../../services/wishlist/mutate";

// 수정 모드로 들어올 때 전달받는 형태
type EditState = {
  mode?: "edit";
  item?: {
    id: number;
    title: string;
    price: number;           // number
    imageSrc?: string;       // 선택
    isPublic: boolean;
  };
};

const WishListRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const edit = (location.state as EditState) || {};

  // 탭
  const [selectedTab, setSelectedTab] = useState<"auto" | "manual">("auto");
  // 공개/비공개 (체크되면 비공개 → locked)
  const [isPrivate, setIsPrivate] = useState(false);

  // auto
  const [url, setUrl] = useState("");

  // manual
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // 숫자 문자열
  // const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // 수정 모드 여부/수정 대상 id
  const isEdit = useMemo(() => edit.mode === "edit" && !!edit.item, [edit]);
  const editId = edit.item?.id;

  // 진입 시/종료 시 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ▶️ 수정 모드 프리필
  useEffect(() => {
    if (isEdit && edit.item) {
      setSelectedTab("manual");                 // 수정은 수동 입력 탭으로
      setName(edit.item.title ?? "");
      setPrice(String(edit.item.price ?? 0));
      setIsPrivate(!edit.item.isPublic);        // 공개여부 반영 (체크=비공개=locked)
      // setImageUrl(edit.item.imageSrc ?? null); // 이미지 업로드 붙이면 사용
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // 체크박스 해제(공개)=unlocked → isPublic=true
      // 체크박스 체크(비공개)=locked → isPublic=false
      const isPublic = !isPrivate;

      // 수정 모드: PATCH
      if (isEdit && editId && selectedTab === "manual") {
        if (!name.trim()) {
          alert("제품명을 입력해 주세요");
          return;
        }
        const priceNumber = Number(price || 0);
        await updateWishlist(editId, {
          productName: name.trim(),
          price: priceNumber,
          // productImageUrl: imageUrl ?? undefined,
          isPublic,
        });

        navigate("/wishlist", {
          replace: true,
          state: { showToast: true, toastMsg: "위시리스트가 수정되었습니다" },
        });
        return;
      }

      // 등록 모드: POST
      if (selectedTab === "auto") {
        if (!url.trim()) {
          alert("상품 링크를 입력해 주세요");
          return;
        }
        await createWishlistByUrl(url.trim(), isPublic);
      } else {
        if (!name.trim()) {
          alert("제품명을 입력해 주세요");
          return;
        }
        const priceNumber = Number(price || 0);
        await createWishlistManual({
          productName: name.trim(),
          price: priceNumber,
          // imageUrl,
          isPublic,
        });
      }

      // 성공 후 이동 + 토스트
      navigate("/wishlist", {
        replace: true,
        state: { showToast: true, toastMsg: "위시리스트가 등록되었습니다" },
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
            <AutoInputSection url={url} onUrlChange={setUrl} />
          )}

          {selectedTab === "manual" && (
            <ManualInputSection
              name={name}
              price={price}
              onNameChange={setName}
              onPriceChange={setPrice}
              // onImageUrlChange={setImageUrl}
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
              {submitting ? (isEdit ? "수정 중..." : "등록 중...") : (isEdit ? "수정하기" : "등록하기")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WishListRegisterPage;
