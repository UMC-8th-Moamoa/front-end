import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import CheckIcon from "../../assets/Check_white.svg"; 
export default function AlbumGridPage() {
  const navigate = useNavigate();
  const { albumName } = useParams();
  const sampleImages = Array(30).fill(null); // 8줄 이상 확보

  // 선택된 사진 인덱스를 상태로 관리
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center px-0 pt-[0px] pb-[100px] bg-white">
      {/* 상단 헤더 */}
      <div className="w-[393px] h-[52px] flex items-center justify-between px-2 bg-white">
        <BackButton />
        <h1 className="text-[18px] font-bold leading-[22px] text-[#1F1F1F] font-pretendard">
          사진 선택
        </h1>

        
<button
  onClick={() => {
    if (selectedIndex !== null) {
      const dummyImageUrl = `/sample${selectedIndex + 1}.jpg`;
      navigate("/moaletter/envelope", {
        state: { imageUrl: dummyImageUrl },
      });
    }
  }}
  className={`text-center text-[18px] font-bold font-pretendard mr-[28px] bg-transparent border-none shadow-none outline-none p-0 ${
    selectedIndex !== null ? "text-[#1F1F1F]" : "text-[#B7B7B7]"
  }`}
  style={{ fontWeight: 700 }}
>
  확인
</button>



      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-3 gap-[4px] w-full max-w-[393px] mt-[4px]">
        {sampleImages.map((_, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="w-[128px] h-[127px] relative cursor-pointer"
              style={
                isSelected
                  ? {
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #EAEAEA",
                    }
                  : { backgroundColor: "#F2F2F2" }
              }
            >
              {isSelected && (
                <img
                  src={CheckIcon}
                  alt="선택됨"
                  className="w-[48px] h-[48px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
