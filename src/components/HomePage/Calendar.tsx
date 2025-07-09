import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FriendBirthdayDummy } from './List/Birthday/FriendBirthdayDummy';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const toggleSelectedDate = (day: Date) => {
    const isSame = selectedDate && isSameDay(day, selectedDate);
    setSelectedDate(isSame ? null : day);
  };

  const renderDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = day;
      const formatted = format(cloneDay, 'yyyy-MM-dd');
      const birthday = FriendBirthdayDummy.find(
        (friend) => friend.birthday === formatted
      );

      const isToday = isSameDay(cloneDay, new Date());
      const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);

      days.push(
        <div
          key={cloneDay.toString()}
          onClick={() => birthday && toggleSelectedDate(cloneDay)}
          className={`w-full aspect-square flex flex-col items-center justify-center text-sm cursor-pointer relative`}
        >
          <div
            className={`flex items-center justify-center ${
              isToday ? 'bg-gray-300 text-white' : 'text-[#0F2552]'
            } ${isToday ? 'w-6 h-6 text-xs rounded-full' : ''}`}
          >
            {format(cloneDay, 'd')}
          </div>
          {birthday && <div className="w-4 h-[2px] bg-gray-500 mt-1 rounded-sm" />}

          {isSelected && (
            <div className="absolute -top-6 bg-white px-4 py-[7px] rounded-[10px] shadow text-[12px] font-medium text-center whitespace-nowrap z-10">
              {
                FriendBirthdayDummy.find(
                  (friend) => friend.birthday === formatted
                )?.name
              }
              님의 생일
            </div>
          )}
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="mt-[20px] mb-[20px] rounded-[16px] p-4 w-[350px] min-h-[360px] bg-[#F7F7F7] shadow flex flex-col items-center relative">
      {/* 월 제목 및 좌우 화살표 */}
      <div className="flex items-center justify-between w-full px-2 mb-1">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="text-[16px] font-semibold text-[#0F2552]">
          {format(currentDate, 'MMMM yyyy')}
        </div>
        <button onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* 구분선 */}
      <div className="mt-[10px] w-full h-[1px] bg-gray-300 mb-2" />

      {/* 요일 헤더 */}
      <div className="mt-[10px] grid grid-cols-7 w-full text-center text-[12px] text-gray-500 mb-[10px]">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 w-full text-center gap-y-[1px]">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
