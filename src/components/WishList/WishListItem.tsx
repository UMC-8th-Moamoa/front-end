// src/components/WishList/WishListItem.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lockedIcon from "../../assets/locked.svg";
import unlockedIcon from "../../assets/unlocked.svg";
import type { WishlistUiItem } from "../../services/wishlist/list";

interface Props {
  item: WishlistUiItem;
  onUpdated?: (next: WishlistUiItem) => void;
  onDeleted?: (id: number) => void;
}

const WishlistItem = ({ item, onUpdated, onDeleted }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 공개/비공개 아이콘을 위한 로컬 상태 (API 없이 즉시 반응)
  const [isPublic, setIsPublic] = useState<boolean>(item.isPublic);

  // 부모에서 item이 갱신되면 동기화
  useEffect(() => {
    setIsPublic(item.isPublic);
  }, [item.isPublic]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const iconSrc = isPublic ? unlockedIcon : lockedIcon;

  const handleEdit = () => {
    navigate("/wishlist/register", {
      state: {
        mode: "edit",
        item: {
          id: item.id,
          title: item.title,
          price: item.price,
          imageSrc: item.imageSrc,
          isPublic,
        },
      },
    });
  };

  // 🔥 API 제거: 확인만 받고 상위 콜백 호출
  const handleDelete = () => {
    const ok = confirm("이 위시리스트 항목을 삭제할까요? (데모 모드: 서버 미연결)");
    if (ok) {
      onDeleted?.(item.id);
      setIsMenuOpen(false);
    }
  };

  // 🔒/🔓 로컬 토글만 수행 (API 호출 제거)
  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isPublic;
    setIsPublic(next);
    onUpdated?.({ ...item, isPublic: next });
  };

  return (
    <div className="w-full bg-white rounded-[14px] shadow-sm flex p-2 gap-4 relative">
      <img
        src={item.imageSrc}
        alt={item.title}
        className="w-[105px] h-[105px] rounded-[10px] object-cover border border-gray-100"
      />

      <div className="flex flex-col justify-between flex-1 relative">
        <div className="flex justify-between items-start">
          <p className="text-[15px] font-medium text-gray-900 leading-tight mt-4">
            {item.title}
          </p>

          <div className="relative mt-4 mr-4">
            <img
              src="/assets/DotMenu.svg"
              alt="메뉴"
              onClick={toggleMenu}
              className="!w-[4px] !h-[18px] object-contain cursor-pointer"
            />
            {isMenuOpen && (
              <div className="absolute top-6 right-0 z-50 bg-white flex items-center rounded-[8px] shadow-md py-[4px] px-[20px] w-[96px] flex-col text-[15px]">
                <button
                  className="text-black text-left py-1 mt-1 hover:opacity-80"
                  onClick={handleEdit}
                >
                  수정하기
                </button>
                <button
                  className="text-red-500 text-left py-1 hover:opacity-80 mt-2 mb-1"
                  onClick={handleDelete}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[20px] font-semibold text-black mb-2">
          {item.priceText}
        </p>

        {/* 🔒/🔓 공개 토글 (로컬 상태만 변경) */}
        <button
          type="button"
          onClick={handleToggleLock}
          aria-label={isPublic ? "비공개로 전환" : "공개로 전환"}
          className="absolute bottom-2 right-2 w-[24px] h-[24px] cursor-pointer"
        >
          <img
            src={iconSrc}
            alt={isPublic ? "unlocked" : "locked"}
            className="w-full h-full"
          />
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
