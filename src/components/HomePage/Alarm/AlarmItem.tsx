interface AlarmItemProps {
    date: string;
    content: string;
  }
  
  const AlarmItem = ({ date, content }: AlarmItemProps) => {
    return (
      <div className="w-[350px] px-4 py-3 border-b mx-auto border-gray-200">
        <p className="text-[12px] text-[#B7B7B7]">{date}</p>
        <p className="text-[18px] text-[#1F1F1F] mt-1">{content}</p>
        <p className="text-[12px] text-[#B7B7B7] mt-2 mb-2">지금 확인하러 가기 &gt;</p>
      </div>
    );
  };
  
  export default AlarmItem;
  