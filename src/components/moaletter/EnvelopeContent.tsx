// components/moaletter/EnvelopeContent.tsx
import { useNavigate, useLocation } from "react-router-dom";
import ItemCard from "./ItemCard";
import Frame from "../../assets/Frame.svg";
import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import Cropper from "react-easy-crop";
import { getUserItems, type UserItem } from "../../services/userItems";

type Area = { x: number; y: number; width: number; height: number };

type Props = {
  selectedId?: number | null;                                    // 현재 선택된 우표 id
  onSelect: (id: number | null, imageUrl?: string) => void;      // 우표 id, 중앙이미지 URL
};

export type EnvelopeHandle = {
  finalizeCrop: () => Promise<string | null>;                    // 저장 직전 호출
};

const EnvelopeContent = forwardRef<EnvelopeHandle, Props>(function EnvelopeContent(
  { selectedId, onSelect },
  ref
) {
  const navigate = useNavigate();
  const location = useLocation();

  // 우표 목록
  const [items, setItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(selectedId ?? null);

  // 크롭 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);           // 갤러리 선택 시에만 true
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 중앙 이미지

  // 우표 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const all = await getUserItems(20);
        setItems(all.filter(x => x.category === "envelope"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 갤러리에서 돌아온 경우에만 크롭 시작
  useEffect(() => {
    const url = (location.state as any)?.imageUrl as string | undefined;
    if (url) {
      setSelectedImage(url);
      setIsCropping(true);
    } else {
      setSelectedImage(null);
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

  // 상단 체크 저장 직전에 부모가 호출
  useImperativeHandle(ref, () => ({
    finalizeCrop: async () => {
      if (selectedImage && isCropping && croppedAreaPixels) {
        const dataUrl = await getCroppedImg(selectedImage, croppedAreaPixels);
        setSelectedImage(dataUrl);
        setIsCropping(false);
        onSelect(selectedEnvelopeId, dataUrl);
        return dataUrl;
      }
      return selectedImage ?? null;
    },
  }));

  // 우표 선택 시 즉시 반영(크롭과 독립)
  const handlePickEnvelope = (id: number) => {
    setSelectedEnvelopeId(id);
    onSelect(id, selectedImage ?? undefined);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 중앙 이미지 영역 */}
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
            ? Array.from({ length: 6 }).map((_, i) => <ItemCard key={i} isLoading={true} label="" />)
            : items.map((it) => (
                <button
                  key={it.holditem_id}
                  onClick={() => handlePickEnvelope(it.holditem_id)}
                  className={`rounded-[12px] overflow-hidden border ${
                    selectedEnvelopeId === it.holditem_id ? "border-[#6282E1]" : "border-transparent"
                  }`}
                >
                  <ItemCard imageSrc={it.image} label={it.name} />
                </button>
              ))}
        </div>
      </div>
    </div>
  );
});

export default EnvelopeContent;
