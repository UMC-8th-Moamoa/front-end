interface AdBannerProps {
  imageUrl?: string;
}

export const AdBanner = ({ imageUrl }: AdBannerProps) => {
  return (
    <div className="w-full px-4 py-3">
      <div className="w-full h-[120px] rounded-[12px] bg-gray-200 flex items-center justify-center">
        {/* 나중에 imageUrl로 대체 */}
        <p className="text-gray-400 text-sm">광고 배너 영역</p>
      </div>
    </div>
  );
};