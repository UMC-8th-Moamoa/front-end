interface ParticipantItemProps {
  name: string;
}

const ParticipantItem = ({ name }: ParticipantItemProps) => {
  return (
    <div className="flex flex-col items-center w-[40px]">
      <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
      <span className="mt-1 text-xs text-center">{name}</span>
    </div>
  );
};

export default ParticipantItem;
