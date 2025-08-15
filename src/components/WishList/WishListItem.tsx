// src/components/WishList/WishListItem.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lockedIcon from "../../assets/locked.svg";
import unlockedIcon from "../../assets/unlocked.svg";
// ✅ updateWishlist는 list.ts에 있음
import { updateWishlist } from "../../services/wishlist/list";
import type { WishlistUiItem } from "../../services/wishlist/list";

interface Props {
  item: WishlistUiItem;
  onUpdated?: (next: WishlistUiItem) => void;
  onDeleted?: (id: number) => void;
}

const WishlistItem = ({ item, onUpdated, onDeleted }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ 아이콘 표시를 위한 로컬 상태(부모 리렌더 없어도 즉시 반응)
  const [isPublic, setIsPublic] = useState<boolean>(item.isPublic);
  const [toggling, setToggling] = useState(false);

  // 부모에서 item이 바뀌면 동기화
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
          isPublic: isPublic, // 로컬 상태 사용
        },
      },
    });
  };

  const handleDelete = async () => {
    try {
      // 삭제 API는 기존 위치 유지
      const { deleteWishlist } = await import("../../services/wishlist/mutate");
      await deleteWishlist(item.id);
      onDeleted?.(item.id);
    } catch (e: any) {
      console.error("[삭제 실패]", e?.response?.data || e);
      alert(e?.response?.data?.message || "삭제에 실패했어요.");
    } finally {
      setIsMenuOpen(false);
    }
  };

  /** 🔒/🔓 클릭 -> 낙관적 토글 후 서버 반영, 실패 시 롤백 */
  const handleToggleLock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;

    const prev = isPublic;
    const next = !prev;

    // 1) 낙관적 업데이트 (아이콘 즉시 전환)
    setIsPublic(next);
    onUpdated?.({ ...item, isPublic: next });

    setToggling(true);
    try {
      await updateWishlist(item.id, { isPublic: next });
      // 성공이면 그대로 두면 됨 (부모가 목록 재조회하더라도 문제 없음)
    } catch (err: any) {
      // 2) 실패 시 롤백
      setIsPublic(prev);
      onUpdated?.({ ...item, isPublic: prev });
      console.error("[공개 여부 변경 실패]", err?.response?.data || err);
      alert(err?.response?.data?.message || "공개 여부 변경에 실패했어요.");
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

        {/* 🔒/🔓 공개 토글 */}
        <button
          type="button"
          onClick={handleToggleLock}
          disabled={toggling}
          aria-label={isPublic ? "비공개로 전환" : "공개로 전환"}
          className={`absolute bottom-2 right-2 w-[24px] h-[24px] ${
            toggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
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
