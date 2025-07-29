import { useEffect, useState } from 'react';
import SubBanner from './SubBanner';
import { dummySubBanners } from './BannerDummy';

const SubBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dummySubBanners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = dummySubBanners[currentIndex];

  return (
    <div className="w-[393px] flex flex-col items-center py-2 space-y-2 transition-all duration-500">
      <SubBanner
        imageSrc={currentItem.imageSrc}
        content={currentItem.content}
        buttonText={currentItem.buttonText}
        onClick={currentItem.onClick}
        variant={currentItem.variant}
      />

      {/* 페이지네이션 인디케이터 */}
      <div className="flex justify-center space-x-[6px] mt-2">
        {dummySubBanners.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SubBannerCarousel;
