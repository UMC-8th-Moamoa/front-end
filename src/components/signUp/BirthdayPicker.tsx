import React, { useState } from 'react';

interface Props {
  year: string;
  month: string;
  day: string;
  onChangeYear: (value: string) => void;
  onChangeMonth: (value: string) => void;
  onChangeDay: (value: string) => void;
}

const BirthdayPicker = ({
  year,
  month,
  day,
  onChangeYear,
  onChangeMonth,
  onChangeDay,
}: Props) => {
  const [editMode, setEditMode] = useState<'year' | 'month' | 'day' | null>(null);

  const getMaxDay = (month: number) => {
    return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : month === 2 ? 29 : 30;
  };

  const handleWheel = (
    e: React.WheelEvent,
    value: string,
    onChange: (v: string) => void,
    type: 'year' | 'month' | 'day'
  ) => {
    e.preventDefault();
    const num = parseInt(value) || 0;
    const maxDay = getMaxDay(+month || 1);

    let newValue = num;

    if (e.deltaY < 0) {
      if (type === 'month' && num < 12) newValue = num + 1;
      else if (type === 'day' && num < maxDay) newValue = num + 1;
      else if (type === 'year' && num < 2025) newValue = num + 1;
    } else {
      if (type === 'month' && num > 1) newValue = num - 1;
      else if (type === 'day' && num > 1) newValue = num - 1;
      else if (type === 'year' && num > 1900) newValue = num - 1;
    }

    onChange(String(newValue).padStart(2, '0'));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (v: string) => void,
    type: 'year' | 'month' | 'day'
  ) => {
    const input = e.target.value.replace(/\D/g, '');

    if (input === '') {
      onChange('');
      return;
    }

    const num = parseInt(input);
    if (isNaN(num)) return;

    if (type === 'year') {
      if (num >= 1900 && num <= 2025) onChange(input);
    } else {
      const max = type === 'month' ? 12 : getMaxDay(+month || 1);
      if (num >= 1 && num <= max) onChange(String(num));
    }
  };

  const renderColumn = (
    value: string,
    onChange: (v: string) => void,
    type: 'year' | 'month' | 'day'
  ) => {
    const max = type === 'year' ? 2025 : type === 'month' ? 12 : getMaxDay(+month || 1);
    const min = type === 'year' ? 1900 : 1;

    const numVal = value === '' ? NaN : parseInt(value);
    const prev = isNaN(numVal)
      ? max
      : numVal === min
      ? max
      : numVal - 1;
    const next = isNaN(numVal)
      ? min
      : numVal === max
      ? min
      : numVal + 1;

    const label = (val: number) =>
      type === 'year'
        ? `${val}년`
        : `${String(val).padStart(2, '0')}${type === 'month' ? '월' : '일'}`;

    return (
      <div
        className="flex flex-col items-center gap-3 w-[70px]"
        onWheel={(e) => handleWheel(e, value, onChange, type)}
      >
        <div className="text-[#97B1FF] text-md">{label(prev)}</div>

        <div className="text-black font-semibold text-lg">
          {editMode === type ? (
            <input
              type="text"
              inputMode="numeric"
              value={value}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleInputChange(e, onChange, type)}
              onBlur={() => setEditMode(null)}
              className="w-full text-center outline-none bg-transparent"
              style={{ appearance: 'none' }}
              placeholder={type === 'year' ? 'YYYY' : type === 'month' ? 'MM' : 'DD'}
            />
          ) : (
            <button onClick={() => setEditMode(type)} className="w-full">
              {isNaN(numVal) ? '' : label(numVal)}
            </button>
          )}
        </div>

        <div className="text-[#97B1FF] text-md">{label(next)}</div>
      </div>
    );
  };

  return (
    <div className="bg-[#E7EDFF] rounded-3xl py-6 px-4 flex justify-center gap-4">
      {renderColumn(year, onChangeYear, 'year')}
      {renderColumn(month.padStart(2, '0'), onChangeMonth, 'month')}
      {renderColumn(day.padStart(2, '0'), onChangeDay, 'day')}
    </div>
  );
};

export default BirthdayPicker;