import { useState } from "react";
import type { Todo, Category } from "../TS/types";
import CalendarGrid from "./CalendarGrid";
import CalendarToolbar from "./CalendarToolbar";
import CalendarSideBar from "./CalendarSideBar";

type Props = {
  todos: Todo[];
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onDeleteCategory: (categoryId: Category["id"]) => void;
  onChangeCategoryColor: (categoryId: Category["id"], color: Category["color"]) => void;
  onToggleTodo: (id: string) => void;
};

const Calendar = (props: Props) => {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const changeMonth = (offset: number) => {
    setDisplayMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  };

  const showToday = () => {
    const today = new Date();
    setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const unscheduledCount = props.todos.filter((todo) => !todo.deadline).length;

  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <section
        aria-label="タスクカレンダー"
        className="min-w-0 w-full flex-1 rounded-lg border border-gray-200 bg-white p-4 text-gray-900"
      >
        <CalendarToolbar
          displayMonth={displayMonth}
          onPreviousMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onToday={showToday}
        />
        <CalendarGrid displayMonth={displayMonth} todos={props.todos} onToggleTodo={props.onToggleTodo} />
        <p className="mt-3 text-sm text-gray-600">期限未設定：{unscheduledCount}件</p>
      </section>
      <CalendarSideBar
        current_categories={props.categories}
        onAddCategory={props.onAddCategory}
        onDeleteCategory={props.onDeleteCategory}
        onChangeCategoryColor={props.onChangeCategoryColor}
      />
    </div>
  );
};

export default Calendar;
