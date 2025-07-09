// src/components/HomePage/Calendar.tsx

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
} from 'date-fns';
import { FriendBirthdayDummy } from './List/Birthday/FriendBirthdayDummy';

const Calendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(startOfMonth(today), { weekStartsOn: 1 }); // 월요일 시작
  const endDate = endOfWeek(endOfMonth(today), { weekStartsOn: 1 });

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = day;
      const formatted = format(cloneDay, 'yyyy-MM-dd');

      const birthday = FriendBirthdayDummy.find(
        (friend) => friend.birthday === formatted
      );

      days.push(
        <div
          key={cloneDay.toString()}
          onClick={() => birthday && setSelectedDate(cloneDay)}
          className={`w-6 h-6 flex flex-col items-center justify-center text-sm rounded-full ${
            isSameDay(cloneDay, today) ? 'bg-gray-300 text-white' : ''
          }`}
        >
          {format(cloneDay, 'd')}
          {birthday && (
            <div className="w-2 h-[2px] bg-gray-400 mt-0.5 rounded-sm" />
          )}
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="rounded-[16px] p-4 w-[350px] h-[360px] bg-white shadow">
      <div className="text-center text-[16px] font-semibold mb-2">
        {format(today, 'MMMM yyyy')}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-600 mb-2">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-3">{renderDays()}</div>

      {/* 생일 정보 표시 */}
      {selectedDate && (
        <div className="mt-3 text-center bg-white rounded-lg shadow px-3 py-2 text-sm font-medium">
          {
            FriendBirthdayDummy.find(
              (friend) =>
                friend.birthday === format(selectedDate, 'yyyy-MM-dd')
            )?.name
          }
          님의 생일
        </div>
      )}
    </div>
  );
};

export default Calendar;
