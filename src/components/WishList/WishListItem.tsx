// src/components/WishList/WishListItem.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WishlistUiItem } from "./WishListSection";
import { deleteWishlist } from "../../services/wishlist/mutate";

interface Props {
  item: WishlistUiItem;
  onUpdated?: (next: WishlistUiItem) => void;
  onDeleted?: (id: number) => void;
}

const WishlistItem = ({ item, onUpdated, onDeleted }: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

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
    const ok = confirm("이 위시리스트 항목을 삭제할까요?");
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteWishlist(item.id);
      onDeleted?.(item.id);
      setIsMenuOpen(false);
    } catch (e: any) {
      console.error("[위시리스트 삭제 실패]", e?.response?.data || e);
      alert("삭제에 실패했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[14px] shadow-sm flex p-2 gap-4 relative opacity-100">
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

          <div className="relative mt-4 mr-4 flex-shrink-0">
            <img
              src="/assets/DotMenu.svg"
              alt="메뉴"
              onClick={toggleMenu}
              className="w-[18px] h-[18px] object-contain cursor-pointer"
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
                  disabled={deleting}
                  className={`text-left py-1 mt-2 mb-1 ${
                    deleting ? "text-gray-400" : "text-red-500 hover:opacity-80"
                  }`}
                  onClick={handleDelete}
                >
                  {deleting ? "삭제중…" : "삭제하기"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[20px] font-semibold text-black mb-2">
          {item.priceText}
        </p>
        {/* 🔒 아이콘 표시/동작 완전 제거 */}
      </div>
    </div>
  );
};

export default WishlistItem;
