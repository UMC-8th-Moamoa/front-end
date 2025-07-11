import React, { useState } from 'react';

interface Props {
  year: string;
  month: string;
  day: string;
  onChangeYear: (value: string) => void;
  onChangeMonth: (value: string) => void;
  onChangeDay: (value: string) => void;
}

const BirthdayPicker = ({ year, month, day, onChangeYear, onChangeMonth, onChangeDay }: Props) => {
  const [editMode, setEditMode] = useState<'year' | 'month' | 'day' | null>(null);

  const renderColumn = (
    value: string,
    onChange: (v: string) => void,
    type: 'year' | 'month' | 'day'
  ) => {
    const prev = String(type === 'year' ? +value - 1 : Math.max(1, +value - 1)).padStart(2, '0');
    const next =
      type === 'year' ? String(+value + 1) : String(Math.min(type === 'day' ? 31 : 12, +value + 1)).padStart(2, '0');

    return (
      <div className="flex flex-col items-center gap-1 w-[70px]">
        {/* 위 */}
        {editMode !== type && (
          <div className="text-gray-400 text-md">
            {type === 'year' ? `${prev}년` : type === 'month' ? `${prev}월` : `${prev}일`}
          </div>
        )}

        {/* 가운데 (입력 또는 보기) */}
        <div
          className={`text-black font-bold text-lg ${
            editMode === type ? 'border-b-2 border-black' : ''
          }`}
        >
          {editMode === type ? (
            <input
              type="number"
              value={value}
              autoFocus
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setEditMode(null)}
              className="w-full text-center outline-none bg-transparent"
            />
          ) : (
            <button onClick={() => setEditMode(type)} className="w-full">
              {type === 'year' ? `${value}년` : type === 'month' ? `${value}월` : `${value}일`}
            </button>
          )}
        </div>

        {/* 아래 */}
        {editMode !== type && (
          <div className="text-gray-400 text-sm">
            {type === 'year' ? `${next}년` : type === 'month' ? `${next}월` : `${next}일`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#eeeeee] rounded-3xl py-6 px-4 flex justify-center gap-4">
      {renderColumn(year, onChangeYear, 'year')}
      {renderColumn(month.padStart(2, '0'), onChangeMonth, 'month')}
      {renderColumn(day.padStart(2, '0'), onChangeDay, 'day')}
    </div>
  );
};

export default BirthdayPicker;