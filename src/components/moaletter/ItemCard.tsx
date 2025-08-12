interface ItemCardProps {
  imageSrc?: string;
  label: string;
  isLoading?: boolean;
}

export default function ItemCard({ imageSrc, label, isLoading = false }: ItemCardProps) {
  return (
    <div className="flex flex-col items-start w-[170px] pb-[13px] rounded-[20px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] shrink-0 box-border">
      {/* 이미지 영역 또는 스켈레톤 */}
      <div
  className={`
    w-[154px] h-[119px] rounded-[14px] overflow-hidden mx-[8px] 
    ${isLoading ? 'bg-gray-200 animate-pulse' : 'bg-[#F2F2F2] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]'}
  `}
>
        {!isLoading && imageSrc && (
          <img src={imageSrc} alt={label} className="w-full h-full object-cover" />
        )}
      </div>

      {/* 라벨 텍스트 또는 스켈레톤 텍스트 */}
      <span className="w-full text-center text-[16px] mt-[11px] font-pretendard font-medium text-[#1F1F1F] leading-normal">
        {isLoading ? (
          <div className="w-[100px] h-[16px] mx-auto bg-gray-200 animate-pulse rounded" />
        ) : (
          label
        )}
      </span>
    </div>
  );
}
