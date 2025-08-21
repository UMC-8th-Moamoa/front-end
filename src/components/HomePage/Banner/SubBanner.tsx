import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import type { SubBannerProps } from "../../../services/banner/banner";

const SubBanner = ({
  imageSrc,
  content,
  buttonText,
  variant = "default",
  onClick,
}: SubBannerProps) => {
  const navigate = useNavigate();

  const isHighlight = variant === "highlight";
  const isImageOnly = variant === "imageOnly";

  const go = () => {
    if (onClick) return onClick();
    // 기본 이동(없으면 선물 인증)
    navigate("/gift-certification");
  };

  if (isImageOnly) {
    return (
      <div
        className="w-[350px] h-[80px] rounded-[20px] overflow-hidden cursor-pointer"
        onClick={go}
      >
        <img
          src={imageSrc === "user" ? "/assets/default.png" : (imageSrc as string)}
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
          : "bg-white border border-[1px] border-[#6282E1] text-[#6282E1]"
      )}
    >
      <div className="flex items-center space-x-4">
        {imageSrc === "user" ? (
          <div className="w-[57px] h-[57px] rounded-full bg-gray-300" />
        ) : (
          <div className="w-[57px] h-[57px] flex items-center justify-center cursor-pointer" onClick={go}>
            <img src={imageSrc} alt="아이콘" />
          </div>
        )}

        <p
          className={clsx(
            "absolute left-[99px] flex items-center text-[18px] pb-4 font-medium leading-tight whitespace-pre-line",
            isHighlight ? "text-white" : "text-[#6282E1]"
          )}
        >
          {content}
        </p>
      </div>

      {buttonText && (
        <span
          className="absolute bottom-3 top-[53px] text-[#6282E1] right-4 text-[12px] cursor-pointer hover:opacity-75 transition-colors"
          onClick={go}
        >
          {buttonText} &gt;
        </span>
      )}
    </div>
  );
};

export default SubBanner;
