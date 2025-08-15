type UiTab = '폰트' | '편지지' | '우표' | '보관함';

type TopMenuProps = {
  selected: UiTab;
  onChange: (tab: UiTab) => void;
};

export const TopMenu = ({ selected, onChange }: TopMenuProps) => {
  const tabs: UiTab[] = ['폰트', '편지지', '우표', '보관함'];

  return (
    <div className="flex justify-around border-b border-[#C7D5FF] text-md font-semibold">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`px-5 py-3 pb-3 cursor-pointer 
            ${selected === tab 
              ? 'text-[#6282E1] border-b-3 border-[#6282E1]' 
              : 'text-[#C7D5FF]'}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};