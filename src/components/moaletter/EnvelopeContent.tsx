import { useNavigate, useLocation } from "react-router-dom";
import ItemCard from "./ItemCard";
import Frame from "../../assets/Frame.svg";
import DefaultImage from "../../assets/default.svg";
import { useEffect, useState } from "react";

export default function EnvelopeContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state에서 전달된 이미지 URL 받기
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.imageUrl) {
      setSelectedImage(location.state.imageUrl);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col items-center pb-[100px]">
      {/* 상단 원형 이미지 박스 */}
      <div className="w-full mt-6 rounded-[24px] bg-gray-200 flex justify-center items-center aspect-square overflow-hidden">
        <img
          src={selectedImage || DefaultImage}
          alt="선택된 이미지"
          className="w-[350px] h-[347px] object-cover"
        />
      </div>

{/* 사진 불러오기 버튼 */}
<div className="w-full max-w-[350px] bg-white rounded-[12px] mt-4">
  <button
    onClick={() => navigate("/moaletter/select-photo")}
    disabled={false}
    className="flex items-center justify-center 
               bg-white !bg-white  // ✅ 강제 흰색
               text-[#B6B6B6] 
               border border-[#B7B7B7] 
               rounded-[12px] 
               w-full h-[50px] px-4 
               shadow-none"
    style={{
      backgroundColor: "#FFFFFF", 
    }}
  >
    <img
      src={Frame}
      alt="사진 불러오기"
      className="w-[24px] h-[24px] mr-[15px] shrink-0 bg-transparent"
    />
    <span className="font-pretendard text-[16px] font-semibold whitespace-nowrap bg-transparent">
      사진 불러오기
    </span>
  </button>
</div>


      {/* 아이템 박스 배열 */}
      <div className="flex justify-center mt-5">
        <div className="flex flex-wrap justify-center gap-x-[16px] gap-y-[20px] px-4 mt-2 overflow-x-hidden">
          {[...Array(6)].map((_, i) => (
            <ItemCard
              key={i}
              imageSrc={""} // 빈 string → 기본 회색 박스만
              label={`아이템명`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
