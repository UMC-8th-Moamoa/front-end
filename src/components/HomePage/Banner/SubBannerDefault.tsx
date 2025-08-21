// src/components/HomePage/Banner/SubBannerDefault.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import defaultProfile from "../../../assets/profile.svg";

type Props = {
  names?: string[];                               // 즉시 전달용 이름 목록
  loadNames?: () => Promise<string[]>;            // 비동기 로더(선택)
  photoByName?: Record<string, string | null>;    // 이름 -> 프로필 URL 매핑
  loadPhotoByName?: () => Promise<Record<string, string | null>>; // 비동기 로더(선택)
  buttonText?: string;                            // 기본: "진행도 보러 가기"
  highlight?: boolean;                            // 기본: false
  rotateMs?: number;                              // 기본: 4000
  onClickImage?: () => void;
  onClickButton?: () => void;
};

const SubBannerDefault = ({
  names,
  loadNames,
  photoByName,
  loadPhotoByName,
  buttonText = "진행도 보러 가기",
  highlight = false,
  rotateMs = 4000,
  onClickImage,
  onClickButton,
}: Props) => {
  const navigate = useNavigate();
  const [pool, setPool] = useState<string[]>(() => names ?? []);
  const [photos, setPhotos] = useState<Record<string, string | null>>(photoByName ?? {});
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 이름 목록 로드
  useEffect(() => {
    let mounted = true;
    if (!names && loadNames) {
      loadNames()
        .then((list) => mounted && setPool(Array.isArray(list) ? list : []))
        .catch(() => mounted && setPool([]));
    } else if (names) {
      setPool(names);
    }
    return () => { mounted = false; };
  }, [names, loadNames]);

  // 프로필 매핑 로드
  useEffect(() => {
    let mounted = true;
    if (!photoByName && loadPhotoByName) {
      loadPhotoByName()
        .then((map) => mounted && setPhotos(map ?? {}))
        .catch(() => mounted && setPhotos({}));
    } else if (photoByName) {
      setPhotos(photoByName);
    }
    return () => { mounted = false; };
  }, [photoByName, loadPhotoByName]);

  // 자동 순환
  useEffect(() => {
    if (pool.length <= 1) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIdx((p) => (p + 1) % pool.length);
    }, rotateMs);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [pool, rotateMs]);

  const currentName = useMemo(() => {
    if (!pool.length) return "친구";
    return pool[idx] || pool[0] || "친구";
  }, [pool, idx]);

  // 현재 이름의 프로필 URL → 없으면 기본 아이콘
  const currentPhoto = useMemo(() => {
    const url = photos[currentName];
    return (typeof url === "string" && url.trim().length > 0) ? url : defaultProfile;
  }, [photos, currentName]);

  const goDefault = () => navigate("/gift-certification");
  const handleImageClick = onClickImage ?? goDefault;
  const handleButtonClick = onClickButton ?? (() => navigate("/moa"));

  return (
    <div
      className={clsx(
        "w-[350px] h-[81px] rounded-2xl px-4 py-4 flex items-center justify-between relative",
        highlight
          ? "bg-gray-300 text-white"
          : "bg-white border border-[1px] border-[gray-200] text-gray-400"
      )}
    >
      <div className="flex items-center space-x-4">
        {/* 프로필 이미지 (없으면 기본 아이콘) */}
        <div className="w-[57px] h-[57px] rounded-full overflow-hidden bg-gray-200 cursor-pointer" onClick={handleImageClick}>
          <img
            src={currentPhoto}
            alt={`${currentName} 프로필`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = defaultProfile; }}
          />
        </div>

        <p
          className={clsx(
            "absolute left-[99px] flex items-center text-[17px] font-medium leading-tight whitespace-pre-line",
            highlight ? "text-white" : "text-gray-400"
          )}
        >
          {`${currentName}님의 모아모아 참여 중`}
        </p>
      </div>

      {buttonText && (
        <span
          className="absolute bottom-3 top-[53px] text-gray-400 right-4 text-[12px] cursor-pointer hover:opacity-75 transition-colors"
          onClick={handleButtonClick}
        >
          {buttonText} &gt;
        </span>
      )}
    </div>
  );
};

export default SubBannerDefault;
