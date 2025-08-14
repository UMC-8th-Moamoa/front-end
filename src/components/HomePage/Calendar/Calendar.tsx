import { useEffect, useMemo, useState } from "react";
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
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBirthdaysByDate, getBirthdaysCalendar, type CalendarMonthItem } from "../../../services/calendar/calendar";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [monthItems, setMonthItems] = useState<CalendarMonthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[] | null>(null);

  // 현재 월의 그리드 범위
  const startDate = useMemo(
    () => startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    [currentDate]
  );
  const endDate = useMemo(
    () => endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
    [currentDate]
  );

  // 월 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 1~12
        const res = await getBirthdaysCalendar({ year, month });
        setMonthItems(res.birthdays ?? []);
      } catch (e) {
        setErr("달력을 불러오지 못했어.");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentDate]);

  // 빠른 조회를 위한 맵
  const mapByDate = useMemo(() => {
    const m = new Map<string, CalendarMonthItem>();
    monthItems.forEach((i) => m.set(i.date, i));
    return m;
  }, [monthItems]);

  const handlePrevMonth = () => {
    setCurrentDate((d) => subMonths(d, 1));
    setSelectedDate(null);
    setSelectedNames(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((d) => addMonths(d, 1));
    setSelectedDate(null);
    setSelectedNames(null);
  };

  const onDayClick = async (day: Date) => {
    const key = format(day, "yyyy-MM-dd");
    const hasBirthday = mapByDate.has(key);
    if (!hasBirthday) return;

    // 토글
    const same = selectedDate && isSameDay(day, selectedDate);
    const nextSel = same ? null : day;
    setSelectedDate(nextSel);
    setSelectedNames(null);

    if (!same) {
      try {
        const detail = await getBirthdaysByDate(key);
        const names = detail.birthdays.map((b) => b.friend.name);
        setSelectedNames(names);
      } catch {
        setSelectedNames(["이름을 불러오지 못했어요"]);
      }
    }
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      const key = format(day, "yyyy-MM-dd");
      const monthItem = mapByDate.get(key);
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      days.push(
        <div
          key={day.toISOString()}
          onClick={() => onDayClick(day)}
          className="w-full aspect-square flex flex-col items-center justify-center text-sm cursor-pointer relative"
        >
          <div
            className={`flex items-center justify-center ${
              isToday ? "bg-black text-white w-6 h-6 text-xs rounded-full" : "text-[#0F2552]"
            }`}
          >
            {format(day, "d")}
          </div>

          {/* 생일 표시 바 */}
          {monthItem && <div className="w-4 h-[2px] bg-[#6282E1] rounded-sm mt-[2px]" />}

          {/* 말풍선 */}
          {isSelected && monthItem && (
            <div className="absolute -top-9 bg-white px-4 py-[7px] rounded-[10px] shadow text-[14px] text-center whitespace-nowrap z-10">
              {selectedNames ? selectedNames.join(", ") : "불러오는 중…"} 님의 생일
            </div>
          )}
        </div>
      );

      day = addDays(day, 1);
    }
    return days;
  };

  return (
    <div className="mt-[20px] mb-[20px] rounded-[16px] p-4 w-[350px] min-h-[360px] bg-white border-[1px] border-[#97B1FF] flex flex-col items-center relative">
      {/* 월 제목 및 좌우 화살표 */}
      <div className="flex items-center justify-between w-full px-2 mb-1">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5 text-[#B7B7B7]" />
        </button>
        <div className="text-[16px] font-semibold text-[#1F1F1F]">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <button onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5 text-[#B7B7B7]" />
        </button>
      </div>

      {/* 구분선 */}
      <div className="mt-[10px] w-full h-[1px] bg-[#97B1FF] mb-2" />

      {/* 요일 헤더 */}
      <div className="mt-[10px] grid grid-cols-7 w-full text-center text-[12px] text-[#97B1FF] mb-[10px]">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 날짜 */}
      {loading ? (
        <div className="py-8 text-sm text-[#97B1FF]">불러오는 중…</div>
      ) : err ? (
        <div className="py-8 text-sm text-red-600">{err}</div>
      ) : (
        <div className="grid grid-cols-7 w-full text-center gap-y-[1px]">{renderDays()}</div>
      )}
    </div>
  );
};

export default Calendar;
