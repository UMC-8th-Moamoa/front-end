// 역할: 우표 선택 + 중앙 이미지(갤러리) 크롭/미리보기
// 변경 요약:
// 1) 데이터 소스: getUserItems → fetchUserItems 로 통일
// 2) 0원 우표 자동 지급: ensureFreeItems("seal", meUserId) 선호출
// 3) 안정 ID: holditem_id 그대로 사용 (음수 합성 제거)

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
  // onSelect: id(보관함 안정 ID), centerImageUrl(중앙 사진 DataURL), stampUrl(우표 URL)
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

  // 크롭 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryImage, setIsGalleryImage] = useState(false);

  // 0원 아이템 자동 지급 → 보관함 로드 → 기본 선택
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        // 1) 무료 우표 자동 지급
        const meUserId = getMyUserId();
        await ensureFreeItems("seal", meUserId);

        // 2) 보관함 로드(우표만 필터)
        const res = await fetchUserItems(200);
        const seals = res.itemListEntry.filter((x) => x.category === "seal");
        setItems(seals);

        // 3) 초기 자동 선택 (부모에도 통지)
        if (selectedEnvelopeId == null && seals.length > 0) {
          const first = seals[0];
          setSelectedEnvelopeId(first.holditem_id);
          setSelectedStampUrl(first.image ?? null);
          onSelect(first.holditem_id, selectedImage ?? undefined, first.image ?? undefined);
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // selectedImage가 바뀌면 부모에게도 최신 프리뷰를 넘겨주기 위해 deps 포함
  }, [selectedEnvelopeId, onSelect, selectedImage]);

  // 갤러리 사진으로 돌아온 경우 크롭 활성화
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

  // 우표 선택
  const handlePickEnvelope = (id: number, stampUrl?: string) => {
    setSelectedEnvelopeId(id);
    setSelectedStampUrl(stampUrl ?? null);
    onSelect(id, selectedImage ?? undefined, stampUrl ?? undefined);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 중앙 이미지 + 우표 오버레이 */}
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
