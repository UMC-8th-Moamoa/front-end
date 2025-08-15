// src/pages/Wishlist/SelectWishPhotoPage.tsx
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import WhitePhoto from "../../assets/WhitePhoto.svg";

type NavState = {
  /** 어떤 탭에서 왔는지 */
  targetTab?: "auto" | "manual";
  /** 되돌아갈 경로 (기본: 위시리스트 등록 페이지) */
  returnTo?: string;
};

export default function SelectWishPhotoPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: NavState };

  // 어디서 왔는지(자동/수동) + 돌아갈 곳
  const targetTab = location.state?.targetTab ?? "auto";
  const returnTo = location.state?.returnTo ?? "/wishlist/register";

  // 파일 선택용 숨김 input
  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // 선택한 이미지 미리보기/전달용 DataURL (한 장만)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // 파일 선택 공통 처리: File → DataURL
  const handlePick = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      setSelectedUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 확인 버튼: 선택한 이미지 URL(DataURL)을 등록 페이지로 전달
  const handleConfirm = () => {
    if (!selectedUrl) return;
    navigate(returnTo, {
      replace: true, // 히스토리 깔끔하게
      state: {
        imageUrl: selectedUrl,
        targetTab, // ✅ 돌아간 뒤 이 탭이 열리도록
      },
    });
  };

  return (
    <div className="flex flex-col items-center px-4 pt-[10px] pb-10">
      {/* 상단: 뒤로가기 / 제목 / 확인 */}
      <div className="flex items-center justify-between w-[393px] mb-[21px]">
        <BackButton />
        <h1 className="text-[18px] font-bold text-black font-pretendard">사진 선택</h1>
        <button
          onClick={handleConfirm}
          disabled={!selectedUrl}
          className={`text-[18px] font-bold font-pretendard bg-transparent border-none shadow-none outline-none p-0 ${
            selectedUrl ? "text-[#1F1F1F]" : "text-[#B7B7B7]"
          }`}
          style={{ fontWeight: 700 }}
        >
          확인
        </button>
      </div>

      {/* 숨김 input: 앨범 선택 */}
      <input
        ref={albumInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handlePick(e.target.files)}
      />

      {/* 숨김 input: 카메라 촬영 (모바일에서 카메라 앱 우선) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => handlePick(e.target.files)}
      />

      {/* 미리보기 박스 */}
      <div className="w-full max-w-[393px]">
        <div className="w-[350px] h-[220px] mx-auto rounded-[16px] bg-[#F2F2F2] border border-[#C7D5FF] flex items-center justify-center overflow-hidden">
          {selectedUrl ? (
            <img
              src={selectedUrl}
              alt="선택한 이미지 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={WhitePhoto}
              alt="placeholder"
              className="w-10 h-10 opacity-70"
            />
          )}
        </div>

        {/* 선택 버튼들 */}
        <div className="w-full max-w-[393px] space-y-3 mt-6 px-1">
          <button
            type="button"
            onClick={() => albumInputRef.current?.click()}
            className="w-full h-[50px] rounded-[12px] border border-[#B7B7B7] bg-white text-[#1F1F1F] font-pretendard text-[16px] font-semibold"
            style={{ fontWeight: 600 }}
          >
            앨범에서 선택
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full h-[50px] rounded-[12px] border border-[#B7B7B7] bg-white text-[#1F1F1F] font-pretendard text-[16px] font-semibold"
            style={{ fontWeight: 600 }}
          >
            카메라로 촬영
          </button>
        </div>
      </div>
    </div>
  );
}
