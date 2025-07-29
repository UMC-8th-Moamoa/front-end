import React from 'react';

type Tab = '유료 충전' | '무료 충전';

interface Props {
  selected: Tab;
  onChange: (tab: Tab) => void;
}

const TabMenu: React.FC<Props> = ({ selected, onChange }) => {
  const tabs = [
    { key: "paid", label: "유료 충전" },
    { key: "free", label: "무료 충전" },
  ];

  return (
    <div className="flex w-full px-4 mt-2 border-b border-[#C7D5FF]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
            selected === tab.label
              ? 'text-[#6282E1] border-b-2 border-[#6282E1]'
              : 'text-[#C7D5FF]'
          }`}
          onClick={() => onChange(tab.label as Tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;