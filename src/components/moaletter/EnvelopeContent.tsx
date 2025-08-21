// src/components/moaletter/EnvelopeContent.tsx
import { useNavigate, useLocation } from "react-router-dom";
import ItemCard from "./ItemCard";
import Frame from "../../assets/Frame.svg";
import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import { fetchUserItems, type UserItem } from "../../api/shopping";
import { ensureFreeItems } from "../../services/freeitems";
import { getMyUserId } from "../../services/mypage";

type Area = { x: number; y: number; width: number; height: number };

type Props = {
  selectedId?: number | null;
  onSelect: (holdSealId: number | null, centerImageUrl?: string, stampUrl?: string) => void;
};

export type EnvelopeHandle = {
  finalizeCrop: () => Promise<string | null>;
};

const EnvelopeContent = forwardRef<EnvelopeHandle, Props>(function EnvelopeContent(
  { selectedId, onSelect },
  ref
) {
  const navigate = useNavigate();
  const location = useLocation();

  // 선택값은 "보유 아이템의 고유 번호(holditem_id)"로만 관리한다.
  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSealHoldId, setSelectedSealHoldId] = useState<number | null>(selectedId ?? null);
  const [selectedStampUrl, setSelectedStampUrl] = useState<string | null>(null);

  // 갤러리 이미지 크롭 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryImage, setIsGalleryImage] = useState(false);

  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const meUserId = getMyUserId();

        // 무료 우표 동기화(멱등). 유저가 없을 땐 조용히 스킵.
        if (meUserId) {
          await ensureFreeItems("seal", meUserId);
        }

        // 내 보관함에서 seal만 뽑아온다. (신규 /letters/user/items 우선)
        const res = await fetchUserItems(200);
        const seals = res.itemListEntry.filter((x) => x.category === "seal");
        setItems(seals);

        // 초기 자동 선택: holditem_id로 통일
        if (seals.length > 0 && selectedId == null && !hasAutoSelected) {
          const first = seals[0];
          setSelectedSealHoldId(first.holditem_id);
          setSelectedStampUrl(first.image ?? null);
          onSelect(first.holditem_id, undefined, first.image ?? undefined);
          setHasAutoSelected(true);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedId, onSelect, hasAutoSelected]);

  // 라우팅 상태에서 이미지 URL을 가져와 크롭 모드 진입
  useEffect(() => {
    const url = (location.state as any)?.imageUrl as string | undefined;
    if (url) {
      setSelectedImage(url);
      setIsGalleryImage(true);
      setIsCropping(true);
    }
  }, [location.state]);

  const onCropComplete = useCallback((_: Area, area: Area) => setCroppedAreaPixels(area), []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No context");
    const TARGET = 200;
    canvas.width = TARGET;
    canvas.height = TARGET;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      TARGET,
      TARGET
    );
    return canvas.toDataURL("image/jpeg");
  };

  useImperativeHandle(ref, () => ({
    finalizeCrop: async () => {
      // 크롭 확정 → dataURL을 부모에 전달. 실제 서버엔 업로드 URL을 보내도록 상위에서 처리.
      if (isGalleryImage && isCropping && selectedImage && croppedAreaPixels) {
        const dataUrl = await getCroppedImg(selectedImage, croppedAreaPixels);
        setSelectedImage(dataUrl);
        setIsCropping(false);
        onSelect(selectedSealHoldId, dataUrl, selectedStampUrl ?? undefined);
        return dataUrl;
      }
      onSelect(selectedSealHoldId, selectedImage ?? undefined, selectedStampUrl ?? undefined);
      return selectedImage ?? null;
    },
  }));

  const handlePickSeal = (holdId: number, stampUrl?: string) => {
    setSelectedSealHoldId(holdId);
    setSelectedStampUrl(stampUrl ?? null);
    // 갤러리 이미지 상태 초기화
    setSelectedImage(null);
    setIsGalleryImage(false);
    setIsCropping(false);
    // 부모에게도 holditem_id로 통지
    onSelect(holdId, undefined, stampUrl ?? undefined);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-[350px] h-[347px] mt-[22px] rounded-[20px] bg-[#F2F2F2] flex justify-center items-center overflow-hidden">
        {selectedImage ? (
          isCropping ? (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropSize={{ width: 200, height: 200 }}
              />
            </div>
          ) : (
            <img
              src={selectedImage}
              alt="선택된 이미지"
              style={{ width: 200, height: 200 }}
              className="object-cover rounded-[20px]"
            />
          )
        ) : (
          <div className="w-full h-full bg-[#F2F2F2]" />
        )}

        {selectedStampUrl && (
          <img
            src={selectedStampUrl}
            alt="선택 우표"
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120,
              height: 120,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <div className="w-full max-w-[350px] bg-white rounded-[12px] mt-[14px]">
        <button
          onClick={() => navigate("/moaletter/select-photo")}
          className="flex items-center justify-center bg-white text-[#4B4B4B] border border-[#B7B7B7] rounded-[12px] w-full h-[50px]"
        >
          <img src={Frame} alt="사진 불러오기" className="w-[24px] h-[24px] mr-[10px]" />
          <span className="font-pretendard text-[16px] font-semibold" style={{ fontWeight: 600 }}>
            사진 불러오기
          </span>
        </button>
      </div>

      <div
        className="w-full max-w-[390px] px-4 mt-[20px] overflow-y-scroll"
        style={{ height: "calc(100vh - 540px)" }}
      >
        <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
          {isLoading ? (
            <div className="col-span-2 text-center text-sm text-gray-500">불러오는 중…</div>
          ) : (
            items.map((it) => (
              <button
                key={it.holditem_id}
                onClick={() => handlePickSeal(it.holditem_id, it.image)}
                className={`rounded-[12px] overflow-hidden border ${
                  selectedSealHoldId === it.holditem_id
                    ? "border-[#6282E1]"
                    : "border-transparent"
                }`}
              >
                {/* 라벨은 보기 용도로 item_no를 노출하되, 로직은 holditem_id만 사용 */}
                <ItemCard imageSrc={it.image} label={it.name || String(it.item_no ?? "")} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default EnvelopeContent;
