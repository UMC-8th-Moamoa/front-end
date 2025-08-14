// src/components/WishList/WishListItem.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import lockedIcon from "../../assets/locked.svg";
import unlockedIcon from "../../assets/unlocked.svg";
import { deleteWishlist, updateWishlist } from "../../services/wishlist/mutate";
import type { WishlistUiItem } from "../../services/wishlist/list";

interface Props {
  item: WishlistUiItem;
  onUpdated?: (next: WishlistUiItem) => void;
  onDeleted?: (id: number) => void;
}

const WishlistItem = ({ item, onUpdated, onDeleted }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // isPublic -> 아이콘
  const iconSrc = item.isPublic ? unlockedIcon : lockedIcon;

  const handleEdit = () => {
    navigate("/wishlist/register", {
      state: {
        mode: "edit",
        item: {
          id: item.id,
          title: item.title,
          price: item.price,
          imageSrc: item.imageSrc,
          isPublic: item.isPublic,
        },
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteWishlist(item.id);
      onDeleted?.(item.id);
    } catch (e: any) {
      console.error("[삭제 실패]", e?.response?.data || e);
      alert(e?.response?.data?.message || "삭제에 실패했어요.");
    } finally {
      setIsMenuOpen(false);
    }
  };

  /** 🔒 아이콘 클릭 -> isPublic 토글 + 서버 반영 */
  const handleToggleLock = async () => {
    if (toggling) return;
    setToggling(true);

    const nextIsPublic = !item.isPublic;

    // 낙관적 UI 업데이트
    const optimistic: WishlistUiItem = { ...item, isPublic: nextIsPublic };
    onUpdated?.(optimistic);

    try {
      const updated = await updateWishlist(item.id, { isPublic: nextIsPublic });
      // 서버 응답을 UI타입으로 이미 변환해줄 거라면 그대로 반영
      onUpdated?.(updated);
    } catch (e: any) {
      // 실패 시 되돌리기
      onUpdated?.(item);
      console.error("[공개여부 변경 실패]", e?.response?.data || e);
      alert(e?.response?.data?.message || "공개 여부 변경에 실패했어요.");
    } finally {
      setToggling(false);
    }
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
              className="w-[4px] h-[18px] object-contain cursor-pointer"
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

        {/* 자물쇠(공개/비공개) 토글 */}
        <button
          type="button"
          onClick={handleToggleLock}
          disabled={toggling}
          aria-label={item.isPublic ? "비공개로 전환" : "공개로 전환"}
          className={`absolute bottom-2 right-2 w-[24px] h-[24px] ${
            toggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <img src={iconSrc} alt={item.isPublic ? "unlocked" : "locked"} className="w-full h-full" />
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
