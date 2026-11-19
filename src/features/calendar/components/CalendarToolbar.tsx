import Icon from "../../../components/ui/Icon";

type Props = {
  displayMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

export default function CalendarToolbar({ displayMonth, onPreviousMonth, onNextMonth, onToday }: Props) {
  return (
    <div className="calendar-toolbar">
      <div className="calendar-title">
        <span className="calendar-title-icon">
          <Icon name="calendar" />
        </span>
        <h2 aria-live="polite">{displayMonth.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}</h2>
      </div>
      <div className="calendar-navigation">
        <button type="button" onClick={onPreviousMonth} className="button button-secondary">
          <Icon name="previous" />
          前月
        </button>
        <button type="button" onClick={onToday} className="button button-secondary">
          今日
        </button>
        <button type="button" onClick={onNextMonth} className="button button-secondary">
          翌月
          <Icon name="next" />
        </button>
      </div>
    </div>
  );
}
