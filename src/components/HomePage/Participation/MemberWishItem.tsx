interface MemberWishItemProps {
  imageUrl: string;
  title: string;
}

const MemberWishItem = ({ imageUrl, title }: MemberWishItemProps) => {
  return (
    <div className="min-w-[119px] mr-[16px]">
      <div className="w-[119px] h-[119px] rounded-[16px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-[16px]"
        />
      </div>
      <p className="mt-[8px] text-[12px] text-black">{title}</p>
    </div>
  );
};

export default MemberWishItem;
