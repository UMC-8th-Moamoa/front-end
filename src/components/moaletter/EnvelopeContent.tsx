import { useNavigate, useLocation } from "react-router-dom";
import ItemCard from "./ItemCard";
import Frame from "../../assets/Frame.svg";
import { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import TestImage from '../../assets/Test.png';
import styles from "./EnvelopeContent.module.css";


type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function EnvelopeContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 현재 렌더링에 쓰일 최종 이미지
  const [croppedImage, setCroppedImage] = useState<string | null>(null);   // 크롭 임시 저장 이미지
  const [isCropping, setIsCropping] = useState(true);                      // 크롭 중 여부
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<{ name: string; image: string }[]>([]);

useEffect(() => {
  // 테스트용 더미 데이터 1초 뒤에 세팅
  setTimeout(() => {
    setItems([
      { name: "봄우표", image: "" },
      { name: "여름우표", image: "" },
      { name: "가을우표", image: "" },
      { name: "겨울우표", image: "" },
    ]);
    setIsLoading(false);
  }, 1000);
}, []);
  const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
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
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
};
 const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
  setCroppedAreaPixels(croppedArea);
}, []);


const [hasTriedToSelectImage, setHasTriedToSelectImage] = useState(false);

useEffect(() => {
  if (location.state && location.state.imageUrl) {
    setSelectedImage(location.state.imageUrl);
    setIsCropping(true);
    setHasTriedToSelectImage(true);
} else {
  // 테스트 이미지로 바로 크롭 테스트
  setSelectedImage(TestImage);
  setIsCropping(true);
  setHasTriedToSelectImage(true);
}
}, [location.state]);







 return (
  <div className="flex flex-col items-center w-full">
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
      <img
        src={selectedImage}
        alt="선택된 이미지"
        className="w-[350px] h-[347px] object-cover"
      />
    )
  ) : hasTriedToSelectImage ? (
    // 사진 선택은 시도했지만 선택 안 된 경우만 테스트 이미지
    <img
      src={TestImage}
      alt="기본 이미지"
      className="w-[350px] h-[347px] object-contain opacity-60"
    />
  ) : null}
</div>





    {/* 사진 불러오기 버튼 */}
<div className="w-full max-w-[350px] bg-white rounded-[12px] mt-[14px]">
  <button
    onClick={() => navigate("/moaletter/select-photo")}
    className="
      flex items-center justify-center 
      bg-white !bg-white
      text-[#B6B6B6] 
      border border-[#B7B7B7] 
      rounded-[12px] 
      w-full h-[50px] px-4 shadow-none
    "
    style={{ backgroundColor: "#FFFFFF" }}
  >
    <img
      src={Frame}
      alt="사진 불러오기"
      className="w-[24px] h-[24px] mr-[15px] shrink-0"
    />
    <span className="font-pretendard text-[16px] font-semibold whitespace-nowrap"style={{ fontWeight: 600 }}>
      사진 불러오기
    </span>
  </button>
</div>


    {/* 아이템 리스트 */}
<div
  className="mt-[8px] w-full max-w-[390px] px-4 mt-[20px] overflow-y-scroll"
  style={{ height: "calc(100vh - 540px)" }}
>
   <div className="grid grid-cols-2 gap-[10px] w-full max-w-[350px]">
    {isLoading
      ? [...Array(6)].map((_, i) => (
          <ItemCard key={i} isLoading={true} label="" />
        ))
      : items.map((item, i) => (
          <ItemCard key={i} imageSrc={item.image} label={item.name} />
        ))}
  </div>
</div>

  </div>
);



}
