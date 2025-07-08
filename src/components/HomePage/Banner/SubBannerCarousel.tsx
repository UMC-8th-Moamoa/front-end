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
    <div className="w-full max-w-[390px] h-[120px] flex items-center justify-center transition-all duration-500">
      <SubBanner
        imageSrc={currentItem.imageSrc}
        content={currentItem.content}
        buttonText={currentItem.buttonText}
        onClick={currentItem.onClick}
        variant={currentItem.variant}
      />
    </div>
  );
};

export default SubBannerCarousel;