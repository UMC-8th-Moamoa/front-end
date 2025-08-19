// src/components/HomePage/Search/SearchUserItem.tsx
import { useNavigate } from "react-router-dom";
import X from "../../../assets/X.svg";

interface SearchUserItemProps {
  name: string;
  userId: string;            // 라우트 파라미터로 쓸 ID(문자열 핸들)
  photo?: string | null;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const FALLBACK = "/assets/profile.svg";

const SearchUserItem = ({
  name,
  userId,
  photo,
  showDeleteButton = false,
  onDelete,
}: SearchUserItemProps) => {
  const navigate = useNavigate();

  const goProfile = () => {
    navigate(`/user/${encodeURIComponent(userId)}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goProfile}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goProfile()}
      className="w-full h-[64px] mt-[20px] flex items-center justify-between cursor-pointer select-none"
      aria-label={`${name} 프로필로 이동`}
    >
      {/* 프로필 + 텍스트 */}
      <div className="flex items-center gap-[12px]">
        <img
          src={photo || FALLBACK}
          alt={`${name}의 프로필`}
          className="w-[64px] h-[64px] rounded-full object-cover"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== window.location.origin + FALLBACK && !img.src.endsWith(FALLBACK)) {
              img.src = FALLBACK;
            }
          }}
        />
        <div className="flex flex-col justify-center">
          <span className="text-[16px] font-medium text-black">{name}</span>
          <span className="text-[16px] font-semibold text-[#B7B7B7]">{userId}</span>
        </div>
      </div>

      {/* X 버튼 (optional) */}
      {showDeleteButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          aria-label="검색 기록 삭제"
        >
          <img src={X} alt="" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchUserItem;
