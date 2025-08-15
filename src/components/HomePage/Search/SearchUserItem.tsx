// src/components/HomePage/Search/SearchUserItem.tsx
import X from "../../../assets/X.svg";

interface SearchUserItemProps {
  name: string;
  userId: string;
  photo?: string | null;           // ✅ API 필드명에 맞춤
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const SearchUserItem = ({
  name,
  userId,
  photo,
  showDeleteButton = false,
  onDelete,
}: SearchUserItemProps) => {
  return (
    <div className="w-full h-[64px] mt-[20px] flex items-center justify-between">
      {/* 프로필 + 텍스트 */}
      <div className="flex items-center gap-[12px]">
        {photo ? (
          <img
            src={photo}                              // ✅ 프리픽스 제거
            alt={`${name}의 프로필`}
            className="w-[64px] h-[64px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[64px] h-[64px] bg-gray-300 rounded-full" />
        )}
        <div className="flex flex-col justify-center">
          <span className="text-[16px] font-medium text-black">{name}</span>
          <span className="text-[16px] font-semibold text-[#B7B7B7]">
            {userId}
          </span>
        </div>
      </div>

      {/* X 버튼 (optional) */}
      {showDeleteButton && (
        <button onClick={onDelete}>
          <img src={X} alt="삭제" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchUserItem;
