// src/pages/MoaLetter/SelectPhotoPage.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

export default function SelectPhotoPage() {
  const navigate = useNavigate();

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

    // FileReader를 사용해 DataURL로 변환하면 라우팅 후에도 URL이 무효화되지 않는다.
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      setSelectedUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 확인 버튼: 선택한 이미지 URL(DataURL)을 WriteLetterPage로 전달
  const handleConfirm = () => {
    if (!selectedUrl) return;
    navigate("/moaletter/write", {
      state: { imageUrl: selectedUrl, openTab: "envelope" },
      // 필요한 경우 replace: true로 히스토리 정리 가능
      // replace: true,
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
        capture="environment" // 필요 시 'user'로 전면 카메라 우선
        style={{ display: "none" }}
        onChange={(e) => handlePick(e.target.files)}
      />

      {/* 본문: 두 개 버튼만 노출 */}
      <div className="w-full max-w-[393px] space-y-3 mt-2">
        <button
          type="button"
          onClick={() => albumInputRef.current?.click()}
          className="w-full h-[50px] rounded-[12px] border border-[#B7B7B7] bg-white text-[#1F1F1F] font-pretendard text-[16px] font-semibold"
          style={{ fontWeight: 600 }}
        >
          앨범 선택
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="w-full h-[50px] rounded-[12px] border border-[#B7B7B7] bg-white text-[#1F1F1F] font-pretendard text-[16px] font-semibold"
          style={{ fontWeight: 600 }}
        >
          카메라 촬영
        </button>
      </div>
    </div>
  );
}
