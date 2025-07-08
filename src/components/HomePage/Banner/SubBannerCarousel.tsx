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
    <div className="w-full py-6 space-y-2 transition-all duration-500">
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