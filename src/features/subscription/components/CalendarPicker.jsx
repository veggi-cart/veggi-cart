import { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const CalendarPicker = ({
  selectedDates,
  onToggleDate,
  onSelectAll,
  onClearAll,
  month,
  year,
  onPrevMonth,
  onNextMonth,
  maxDays,
}) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    // Monday=0 offset
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    // Empty leading cells
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      cells.push(date);
    }

    return cells;
  }, [month, year]);

  const selectableDates = useMemo(
    () => calendarDays.filter((d) => d && d > today),
    [calendarDays, today],
  );

  const allSelected = selectableDates.length > 0 && selectableDates.every((d) => selectedDates.has(toDateKey(d)));
  const atLimit = maxDays > 0 && selectedDates.size >= maxDays;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const canGoPrev = month > today.getMonth() || year > today.getFullYear();

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>
        <h3 className="font-bold text-slate-800 text-lg">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={onNextMonth}
          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Select all / Clear toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          {selectedDates.size} day{selectedDates.size !== 1 ? "s" : ""} selected
          {maxDays > 0 && (
            <span className="text-slate-400"> / {maxDays} max</span>
          )}
        </span>
        <div className="flex gap-2">
          {selectedDates.size > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => onSelectAll(selectableDates)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              allSelected
                ? "text-brand bg-emerald-50"
                : "text-brand hover:bg-emerald-50"
            }`}
          >
            {allSelected ? "All Selected" : "Select All"}
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const key = toDateKey(date);
          const isPast = date <= today;
          const isSelected = selectedDates.has(key);
          const isToday = date.getTime() === today.getTime();
          const disabled = isPast || (!isSelected && atLimit);

          return (
            <button
              key={key}
              onClick={() => !disabled && onToggleDate(key)}
              disabled={disabled}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-150 relative
                ${
                  isSelected
                    ? "bg-brand text-white shadow-sm"
                    : isPast
                    ? "text-slate-300 cursor-not-allowed"
                    : disabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-brand"
                }
                ${isToday && !isSelected ? "ring-2 ring-brand/30 ring-inset" : ""}
              `}
            >
              {isSelected ? (
                <div className="flex flex-col items-center">
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{date.getDate()}</span>
                </div>
              ) : (
                date.getDate()
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CalendarPicker);
