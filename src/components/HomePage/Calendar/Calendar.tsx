// src/components/HomePage/Calendar/Calendar.tsx
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
import {
  getBirthdaysByDate,
  getBirthdaysCalendar,
  type CalendarMonthItem,
} from "../../../services/calendar/calendar";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [monthItems, setMonthItems] = useState<CalendarMonthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[] | null>(null);

  // 현재 월의 그리드 범위 (월요일 시작)
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
      } catch {
        setErr("달력을 불러오지 못했어.");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentDate]);

  // 빠른 조회용 맵: "YYYY-MM-DD" -> 항목
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
    const monthItem = mapByDate.get(key);
    if (!monthItem) return; // 해당 날짜에 생일 없음

    // 토글(같은 날 다시 누르면 닫기)
    const same = !!selectedDate && isSameDay(day, selectedDate);
    const nextSel = same ? null : day;
    setSelectedDate(nextSel);
    setSelectedNames(null);

    if (!same) {
      try {
        const detail = await getBirthdaysByDate(key);

        // ✅ 이름 경로를 유연하게 파싱 + 빈 값 제거
        let names =
          (detail.birthdays ?? [])
            .map((b: any) =>
              b?.friend?.name ??
              b?.name ??
              b?.friendName ??
              b?.user?.name ??
              b?.nickname ??
              ""
            )
            .map((s: any) => (typeof s === "string" ? s.trim() : ""))
            .filter((s: string) => s.length > 0) || [];

        // ✅ 혹시 상세 API가 비었으면 월 데이터로 보강
        if (names.length === 0 && Array.isArray(monthItem.friends)) {
          names = monthItem.friends
            .map((f: any) => (typeof f?.name === "string" ? f.name.trim() : ""))
            .filter((s: string) => s.length > 0);
        }

        setSelectedNames(names.length > 0 ? names : ["이름 없음"]);
      } catch {
        setSelectedNames(["이름을 불러오지 못했어요"]);
      }
    }
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      // 🔧 루프 내 날짜를 복사해서 클릭 핸들러에 고정 (클로저 이슈 방지)
      const d = new Date(day.getTime());
      const key = format(d, "yyyy-MM-dd");
      const monthItem = mapByDate.get(key);
      const isToday = isSameDay(d, new Date());
      const isSelected = !!selectedDate && isSameDay(d, selectedDate);

      const bubbleText =
        selectedNames == null
          ? "불러오는 중…"
          : selectedNames.length === 0
          ? "이름 없음"
          : selectedNames.length === 1
          ? `${selectedNames[0]}님의 생일`
          : `${selectedNames.join(", ")} 님들의 생일`;

      days.push(
        <div
          key={key}
          onClick={() => monthItem && onDayClick(d)} // 생일 있는 날만 클릭 허용
          className={`w-full aspect-square flex flex-col items-center justify-center text-sm relative overflow-visible ${
            monthItem ? "cursor-pointer" : "cursor-default"
          }`}
          role="button"
          aria-label={`${key}${monthItem ? " 생일 있음" : ""}`}
        >
          <div
            className={`flex items-center justify-center ${
              isToday
                ? "bg-black text-white w-6 h-6 text-xs rounded-full"
                : "text-[#0F2552]"
            }`}
          >
            {format(d, "d")}
          </div>

          {/* 생일 표시 바 */}
          {monthItem && (
            <div className="w-4 h-[2px] bg-[#6282E1] rounded-sm mt-[2px]" />
          )}

          {/* 말풍선 모달 */}
          {isSelected && monthItem && (
            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-white px-4 py-[7px] rounded-[10px] shadow text-[15px] text-center whitespace-nowrap z-30">
              {bubbleText}
            </div>
          )}
        </div>
      );

      day = addDays(day, 1);
    }
    return days;
  };

  return (
    <div className="mt-[20px] mb-[10px] rounded-[16px] p-4 w-[350px] min-h-[360px] bg-white border-[1px] border-[#97B1FF] flex flex-col items-center relative overflow-visible">
      {/* 월 제목 및 좌우 화살표 */}
      <div className="flex items-center justify-between w-full px-2 mb-1">
        <button onClick={handlePrevMonth} aria-label="이전 달">
          <ChevronLeft className="w-5 h-5 text-[#B7B7B7]" />
        </button>
        <div className="text-[16px] font-semibold text-[#1F1F1F]">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <button onClick={handleNextMonth} aria-label="다음 달">
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

      {/* 날짜 그리드 */}
      {loading ? (
        <div className="py-8 text-sm text-[#97B1FF]">불러오는 중…</div>
      ) : err ? (
        <div className="py-8 text-sm text-red-600">{err}</div>
      ) : (
        <div className="grid grid-cols-7 w-full text-center gap-y-[1px] overflow-visible">
          {renderDays()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
