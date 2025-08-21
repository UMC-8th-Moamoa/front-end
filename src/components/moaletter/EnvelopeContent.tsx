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
  onSelect: (id: number | null, centerImageUrl?: string, stampUrl?: string) => void;
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

  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(selectedId ?? null);
  const [selectedStampUrl, setSelectedStampUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryImage, setIsGalleryImage] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false); // New state to track if an item has been auto-selected

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const meUserId = getMyUserId();
        await ensureFreeItems("seal", meUserId);
        const res = await fetchUserItems(200);
        const seals = res.itemListEntry.filter((x) => x.category === "seal");
        setItems(seals);

        // Auto-select the first item and notify the parent component
        if (seals.length > 0 && selectedId == null && !hasAutoSelected) {
          const first = seals[0];
          setSelectedEnvelopeId(first.holditem_id);
          setSelectedStampUrl(first.image ?? null);
          onSelect(first.holditem_id, undefined, first.image ?? undefined);
          setHasAutoSelected(true); // Set the flag to true after auto-selection
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedId, onSelect, hasAutoSelected]);

  // 라우팅 상태에서 이미지 URL을 가져와 상태 업데이트
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
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, TARGET, TARGET
    );
    return canvas.toDataURL("image/jpeg");
  };

  useImperativeHandle(ref, () => ({
    finalizeCrop: async () => {
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

  const handlePickEnvelope = (id: number, stampUrl?: string) => {
    setSelectedEnvelopeId(id);
    setSelectedStampUrl(stampUrl ?? null);
    // Reset crop state when selecting a pre-existing stamp
    setSelectedImage(null);
    setIsGalleryImage(false);
    setIsCropping(false);
    // Notify the parent component of the new selection
    onSelect(id, undefined, stampUrl ?? undefined);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-[350px] h-[347px] mt-[22px] rounded-[20px] bg-[#F2F2F2] flex justify-center items-center overflow-hidden">
        {selectedImage ? (
          isCropping ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              pointerEvents: "none"
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

      <div className="w-full max-w-[390px] px-4 mt-[20px] overflow-y-scroll" style={{ height: "calc(100vh - 540px)" }}>
        <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading label="" />)
            : items.map((it) => (
                <button
                  key={it.holditem_id}
                  onClick={() => handlePickEnvelope(it.holditem_id, it.image)}
                  className={`rounded-[12px] overflow-hidden border ${
                    selectedEnvelopeId === it.holditem_id ? "border-[#6282E1]" : "border-transparent"
                  }`}
                >
                  <ItemCard imageSrc={it.image} label={it.name || String(it.item_no ?? "")} />
                </button>
              ))}
        </div>
      </div>
    </div>
  );
});

export default EnvelopeContent;