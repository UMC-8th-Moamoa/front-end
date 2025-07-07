import type { MainBannerProps } from "../../../types/banner";

const MainBanner = ({ title, buttonText, onClick, imageSrc }: MainBannerProps) => {
  return (
    <div className="w-[350px] h-[155px] bg-gray-300 rounded-2xl p-4 relative overflow-hidden">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="모아"
          className="absolute -left-10 top-[75%] transform -translate-y-1/2 rotate-[25deg] w-[240px] h-auto"
        />
      )}

      <div className="ml-[38%] text-white pt-2">
        <h2 className="absolute top-[24px] left-[167px] font-bold text-[20px] leading-tight ">{title}</h2>
      </div>

      <div className="absolute bottom-3 right-4">
        <span
          onClick={onClick}
          className="text-[12px] text-white cursor-pointer hover:text-white transition-colors"
        >
          {buttonText} &gt;
        </span>
      </div>
    </div>
  );
};

export default MainBanner;
