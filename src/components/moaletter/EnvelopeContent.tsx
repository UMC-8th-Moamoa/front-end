import { useNavigate, useLocation } from "react-router-dom";
import ItemCard from "./ItemCard";
import Frame from "../../assets/Frame.svg";
import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import { getUserItems, type UserItem, isStamp } from "../../services/userItems";

type Area = { x: number; y: number; width: number; height: number };

type Props = {
  selectedId?: number | null;
  // id: 우표 안정 ID(구매: 양수, 기본: 음수)
  // centerImageUrl: 중앙 사진(DataURL) — 갤러리에서 고른 경우
  // stampUrl: 우표 이미지 URL(미리보기/저장확인용)
  onSelect: (id: number | null, centerImageUrl?: string, stampUrl?: string) => void;
};

export type EnvelopeHandle = {
  finalizeCrop: () => Promise<string | null>;
};

// 구매/기본 아이템 모두 커버하는 안정 ID
function stableIdOf(it: UserItem): number {
  if (typeof it.holditem_no === "number" && !Number.isNaN(it.holditem_no)) return it.holditem_no;
  const n = Number(String(it.item_no).replace(/\D/g, "").slice(-6)) || String(it.item_no).length;
  return -Math.abs(n);
}

const EnvelopeContent = forwardRef<EnvelopeHandle, Props>(function EnvelopeContent(
  { selectedId, onSelect },
  ref
) {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(selectedId ?? null);
  const [selectedStampUrl, setSelectedStampUrl] = useState<string | null>(null);

  // 크롭 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryImage, setIsGalleryImage] = useState(false); // 갤러리에서 고른 경우만 크롭

  // 우표(STAMP) 목록 로드 + 기본 선택
  useEffect(() => {
    (async () => {
      try {
        const page = await getUserItems("STAMP", 1, 20, { includeDefault: true });
        const list = (page.content || []).filter((x) => isStamp(x.category));
        setItems(list);

        // ✅ 초기 진입 시 기본(또는 첫 번째) 우표 자동 선택
        if (selectedEnvelopeId == null && list.length > 0) {
          const def = (list as any[]).find((x: any) => x.isDefault) ?? list[0];
          const sid = stableIdOf(def);
          setSelectedEnvelopeId(sid);
          setSelectedStampUrl(def.image);
          onSelect(sid, selectedImage ?? undefined, def.image);
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // selectedImage가 바뀌면 부모로 함께 알려주기 위해 deps 포함
  }, [selectedEnvelopeId, onSelect, selectedImage]);

  // 갤러리에서 돌아온 경우에만 크롭 활성화
  useEffect(() => {
    const url = (location.state as any)?.imageUrl as string | undefined;
    if (url) {
      setSelectedImage(url);
      setIsGalleryImage(true);
      setIsCropping(true);
    } else {
      setSelectedImage(null);
      setIsGalleryImage(false);
      setIsCropping(false);
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
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, pixelCrop.width, pixelCrop.height
    );
    return canvas.toDataURL("image/jpeg");
  };

  useImperativeHandle(ref, () => ({
    finalizeCrop: async () => {
      // 갤러리 사진일 때만 실제 크롭 수행
      if (isGalleryImage && isCropping && selectedImage && croppedAreaPixels) {
        const dataUrl = await getCroppedImg(selectedImage, croppedAreaPixels);
        setSelectedImage(dataUrl);
        setIsCropping(false);
        onSelect(selectedEnvelopeId, dataUrl, selectedStampUrl ?? undefined);
        return dataUrl;
      }
      onSelect(selectedEnvelopeId, selectedImage ?? undefined, selectedStampUrl ?? undefined);
      return selectedImage ?? null;
    },
  }));

  // 우표 선택 → 안정 ID/이미지 모두 반영
  const handlePickEnvelope = (sid: number, stampUrl: string) => {
    setSelectedEnvelopeId(sid);
    setSelectedStampUrl(stampUrl);
    onSelect(sid, selectedImage ?? undefined, stampUrl);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 중앙 이미지 + 우표 오버레이 미리보기 */}
      <div className="relative w-[350px] h-[347px] mt-[22px] rounded-[20px] bg-[#F2F2F2] flex justify-center items-center overflow-hidden">
        {selectedImage ? (
          isCropping ? (
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
          ) : (
            <img src={selectedImage} alt="선택된 이미지" className="w-[350px] h-[347px] object-cover" />
          )
        ) : (
          <div className="w-full h-full bg-[#F2F2F2]" />
        )}

        {/* 선택 우표 오버레이 */}
        {selectedStampUrl && (
          <img
            src={selectedStampUrl}
            alt="선택 우표"
            className="absolute"
            style={{ top: 12, left: 16, width: 120, height: 120, pointerEvents: "none" }}
          />
        )}
      </div>

      {/* 사진 불러오기 */}
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

      {/* 우표 리스트 */}
      <div className="w-full max-w-[390px] px-4 mt-[20px] overflow-y-scroll" style={{ height: "calc(100vh - 540px)" }}>
        <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading label="" />)
            : items.map((it) => {
                const sid = stableIdOf(it);
                return (
                  <button
                    key={(sid > 0 ? "o" : "d") + "-" + sid}
                    onClick={() => handlePickEnvelope(sid, it.image)}
                    className={`rounded-[12px] overflow-hidden border ${
                      selectedEnvelopeId === sid ? "border-[#6282E1]" : "border-transparent"
                    }`}
                  >
                    <ItemCard imageSrc={it.image} label={it.name ?? it.item_no} />
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
});

export default EnvelopeContent;
