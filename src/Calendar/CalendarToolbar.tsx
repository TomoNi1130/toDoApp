type Props = {
  displayMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

const CalendarToolbar = (props: Props) => {
  const buttonClass =
    "rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 aria-live="polite" className="text-xl font-bold">
        {props.displayMonth.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
        })}
      </h2>
      <div className="flex gap-2">
        <button type="button" onClick={props.onPreviousMonth} className={buttonClass}>
          前月
        </button>
        <button type="button" onClick={props.onToday} className={buttonClass}>
          今日
        </button>
        <button type="button" onClick={props.onNextMonth} className={buttonClass}>
          翌月
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
