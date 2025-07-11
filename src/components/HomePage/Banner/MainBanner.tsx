import type { MainBannerProps } from "../../../types/banner";

const MainBanner = ({ title, buttonText, onClick, imageSrc }: MainBannerProps) => {
  return (
    <div className="w-[393px] flex justify-center px-5 py-2">
      <div
        className="w-full h-[155px] bg-[#D9D9D9] rounded-2xl p-4 relative overflow-hidden cursor-pointer"
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
          <span className="font-bold">채원</span>님을 위한<br />모아가 완성됐어요!
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
