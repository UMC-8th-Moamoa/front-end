interface ParticipantItemProps {
  name: string;
  profile?: string | null;
}

const ParticipantItem = ({ name, profile }: ParticipantItemProps) => {
  const src = profile || "/assets/profile.svg";
  return (
    <div className="flex flex-col items-center w-[40px]">
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200">
        <img src={src} alt={`${name} 프로필`} className="w-full h-full object-cover" />
      </div>
      <span className="mt-1 text-xs text-center">{name}</span>
    </div>
  );
};

export default ParticipantItem;
