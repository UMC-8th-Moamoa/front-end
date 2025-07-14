interface SearchUserItemProps {
  name: string;
  userId: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const SearchUserItem = ({
  name,
  userId,
  showDeleteButton = false,
  onDelete,
}: SearchUserItemProps) => {
  return (
    <div className="w-full h-[64px] mt-[20px] flex items-center justify-between">
      {/* 프로필 + 텍스트 */}
      <div className="flex items-center gap-[12px]">
        <div className="w-[64px] h-[64px] bg-gray-300 rounded-full" />
        <div className="flex flex-col justify-center">
          <span className="text-[16px] font-medium text-black">{name}</span>
          <span className="text-[16px] font-semibold text-gray-500">
            {userId}
          </span>
        </div>
      </div>

      {/* X 버튼 (optional) */}
      {showDeleteButton && (
        <button onClick={onDelete}>
          <img src="/assets/X.svg" alt="삭제" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchUserItem;
