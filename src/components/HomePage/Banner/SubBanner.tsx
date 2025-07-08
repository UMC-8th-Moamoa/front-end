import type { SubBannerProps } from "../../../types/banner";
import clsx from "clsx"; 

const SubBanner = ({ imageSrc, content, buttonText, onClick, variant}: SubBannerProps) => {
  const isHighlight = variant === "highlight";

  console.log("SubBanner variant:", variant);

  return (
    <div
      className={clsx(
        "w-[350px] h-[81px] rounded-2xl px-4 py-4 flex items-center justify-between relative",
        isHighlight
          ? "bg-gray-300 text-white"
          : "bg-white border border-gray-200 text-gray-400"
      )}
    >
      <div className="flex items-center space-x-4">
        {imageSrc && (
          <div
            className={clsx(
              "w-[57px] h-[57px] flex-shrink-0 flex items-center justify-center rounded-full"
            )}
          >
            <img src={imageSrc} alt="아이콘"/>
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
          onClick={onClick}
          className={clsx(
            "absolute bottom-3 top-[53px] text-gray-400 right-4 text-[12px] cursor-pointer hover:opacity-80 transition-colors"
          )}
        >
          {buttonText} &gt;
        </span>
      )}
    </div>
  );
};

export default SubBanner;
