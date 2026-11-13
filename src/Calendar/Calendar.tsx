import { useState } from "react";
import type { Todo } from "../TS/types";
import CalendarGrid from "./CalendarGrid";
import CalendarToolbar from "./CalendarToolbar";

type Props = {
  todos: Todo[];
};

const Calendar = (props: Props) => {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const changeMonth = (offset: number) => {
    setDisplayMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  };

  const showToday = () => {
    const today = new Date();
    setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const unscheduledCount = props.todos.filter((todo) => !todo.deadline).length;

  return (
    <section
      aria-label="タスクカレンダー"
      className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900"
    >
      <CalendarToolbar
        displayMonth={displayMonth}
        onPreviousMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onToday={showToday}
      />
      <CalendarGrid displayMonth={displayMonth} todos={props.todos} />
      <p className="mt-3 text-sm text-gray-600">
        期限未設定：{unscheduledCount}件
      </p>
    </section>
  );
};

export default Calendar;
