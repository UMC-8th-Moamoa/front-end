// src/components/HomePage/Banner/SubBanner.tsx
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import type { SubBannerProps } from "../../../types/banner";

const SubBanner = ({ imageSrc, content, buttonText, variant }: SubBannerProps) => {
  const navigate = useNavigate();

  const isHighlight = variant === "highlight";
  const isImageOnly = variant === "imageOnly";

  if (isImageOnly) {
    return (
      <div
        className="w-[350px] h-[80px] rounded-[20px] overflow-hidden cursor-pointer"
        onClick={() => navigate("/gift-certification")}
      >
        <img
          src={imageSrc}
          alt="배너"
          className="w-full h-full object-cover rounded-[20px]"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "w-[350px] h-[81px] rounded-2xl px-4 py-4 flex items-center justify-between relative",
        isHighlight
          ? "bg-gray-300 text-white"
          : "bg-white border border-[1px] border-gray-200 text-gray-400"
      )}
    >
      <div className="flex items-center space-x-4">
        {imageSrc === "user" ? (
          <div className="w-[57px] h-[57px] rounded-full bg-gray-300" />
        ) : (
          <div
            className="w-[57px] h-[57px] flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/gift-certification")}
          >
            <img src={imageSrc} alt="아이콘" />
          </div>
        )}

        <p
          className={clsx(
            "absolute left-[99px] flex items-center text-[18px] font-medium leading-tight whitespace-pre-line",
            isHighlight ? "text-white" : "text-gray-400"
          )}
        >
          {content}
        </p>
      </div>

      {buttonText && (
        <span
          className="absolute bottom-3 top-[53px] text-gray-400 right-4 text-[12px] cursor-pointer hover:opacity-75 transition-colors"
        >
          {buttonText} &gt;
        </span>
      )}
    </div>
  );
};

export default SubBanner;
