import React from 'react';

type Option = {
  id: number;
  label: string; // 예: "10MC"
  price: number; // 예: 1000
  discount?: number; // 예: -500
};

type Props = {
  options: Option[];
  selectedId: number;
  onSelect: (id: number) => void;
};

const ChangeOptionList: React.FC<Props> = ({ options, selectedId, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer ${
            selectedId === option.id ? 'border-[#6282E1]' : 'border-gray-200'
          }`}
          onClick={() => onSelect(option.id)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedId === option.id ? 'border-[#6282E1]' : 'border-gray-300'
              }`}
            >
              {selectedId === option.id && <div className="w-2.5 h-2.5 bg-[#6282E1] rounded-full" />}
            </div>
            <span className="text-base font-medium">{option.label}</span>
          </div>

          <div className="text-right flex flex-row gap-3 items-end">
            {option.discount ? (
              <>
                <p className="text-xs text-[#E20938] mb-1">- ₩{Math.abs(option.discount).toLocaleString()}</p>
                <p className="text-base font-semibold text-[#6C6C6C]">₩{option.price.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-base font-semibold text-[#6C6C6C]">₩{option.price.toLocaleString()}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default ChangeOptionList;