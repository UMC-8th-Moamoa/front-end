import { useEffect, useMemo, useRef, useState } from "react";
import SubBanner from "./SubBanner";
import { fetchMoasAndBanners } from "../../../services/banner/banner";
import { SUB_NEEDS_NAME, SubBannerImage, fillName } from "../../../services/banner/bannerassets";
import type { SubBannerPayload } from "../../../services/banner/banner";

/**
 * 서버 subBanners를 가져와서 1개씩 자동 슬라이드
 * - 페이지네이션 인디케이터 포함
 * - items 프롭 없이 자체 fetch (필요하면 props로도 확장 가능)
 */
const SubBannerCarousel = ({ userName }: { userName?: string }) => {
  const [items, setItems] = useState<SubBannerPayload[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fetchMoasAndBanners({ limit: 10 })
      .then((s) => setItems(s.subBanners ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length]);

  const current = items[currentIndex];

  const bannerProps = useMemo(() => {
    if (!current) return null;

    const needsName = SUB_NEEDS_NAME.includes(current.type);
    const content = needsName
      ? fillName(current.title, userName)
      : current.title;

    // 이미지형(기본): certification 등
    const imageSrc =
      current.type in SubBannerImage
        ? SubBannerImage[current.type]
        : SubBannerImage.default;

    // participating 은 이름 치환 강조형으로 보여주고,
    // certification 등은 이미지 전용으로
    const variant =
      current.type === "participating" ? "default" : "imageOnly";

    const buttonText =
      current.type === "participating" ? "진행도 보러 가기" :
      current.actionText || undefined;

    const onClick = () => {
      // 타입별 라우팅은 여기서 처리(원하면 교체)
      if (current.type === "certification") {
        // 선물 인증하기
        window.location.href = "/gift-certification";
      } else {
        // 참여/진행 보기
        window.location.href = `/moa/${current.moaId}`;
      }
    };

    return { imageSrc, content, buttonText, variant, onClick } as const;
  }, [current, userName]);

  if (!current || !bannerProps) return null;

  return (
    <div className="w-[393px] flex flex-col items-center py-2 space-y-2 transition-all duration-500">
      <SubBanner
        imageSrc={bannerProps.imageSrc}
        content={bannerProps.content}
        buttonText={bannerProps.buttonText}
        variant={bannerProps.variant}
        onClick={bannerProps.onClick}
      />

      {/* 페이지네이션 인디케이터 */}
      <div className="flex justify-center space-x-[6px] mt-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-[#97B1FF]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SubBannerCarousel;
