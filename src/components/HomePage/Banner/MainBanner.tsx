import type { MainBannerProps } from "../../../types/banner";

const MainBanner = ({ title, buttonText, onClick, imageSrc }: MainBannerProps) => {
  return (
    <div className="w-[393px] flex justify-center px-5 py-2">
      <div
        className="w-full h-[155px] bg-gradient-to-br from-[#6282E1] to-[#FEC3FF] rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt="모아"
            className="absolute -left-10 top-[75%] transform -translate-y-1/2 rotate-[25deg] w-[240px] h-auto"
          />
        )}

        <h2 className="absolute top-[24px] left-[167px] text-[20px] leading-tight text-white">
          <span className="font-bold">채원님</span>을 위한<br />모아가 진행 중이에요!
        </h2>

        <div className="absolute bottom-3 right-4">
          <span className="text-[12px] text-white">
            {buttonText} &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
