import { useState } from "react";
import type { Todo } from "../../../types/todo";
import CalendarGrid from "./CalendarGrid";
import CalendarToolbar from "./CalendarToolbar";

type Props = { todos: Todo[]; onSelectTodo: (id: string) => void };

export default function Calendar({ todos, onSelectTodo }: Props) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const changeMonth = (offset: number) =>
    setDisplayMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  const unscheduledCount = todos.filter((todo) => !todo.deadline).length;

  return (
    <section aria-label="タスクカレンダー" className="panel calendar-panel">
      <CalendarToolbar
        displayMonth={displayMonth}
        onPreviousMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onToday={() => {
          const today = new Date();
          setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        }}
      />
      <CalendarGrid displayMonth={displayMonth} todos={todos} onSelectTodo={onSelectTodo} />
      <p className="calendar-footer">期限未設定：{unscheduledCount}件</p>
    </section>
  );
}
