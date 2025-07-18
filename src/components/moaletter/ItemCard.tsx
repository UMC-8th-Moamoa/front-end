interface ItemCardProps {
  imageSrc?: string;
  label: string;
}

export default function ItemCard({ imageSrc, label }: ItemCardProps) {
  return (
<div className="flex flex-col items-start w-[170px] p-[8px] pt-[8px] pb-[13px] gap-[11px] rounded-[20px] bg-white shadow-md box-border">
      <div className="w-[154px] h-[119px] rounded-[14px] bg-[#E1E1E1] overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={label} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <span className="w-full text-center text-[16px] font-pretendard font-medium text-[#1F1F1F] leading-normal">
        {label}
      </span>
    </div>
  );
}
