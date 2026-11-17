import { categoryColorClasses, type Todo } from "../TS/types";

type Props = {
  displayMonth: Date;
  todos: Todo[];
  onToggleTodo: (id: string) => void;
};

// UTCに変換せず、端末のタイムゾーンで日付を比較する。
const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

const CalendarGrid = ({ displayMonth, todos, onToggleTodo }: Props) => {
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);
  const todayKey = dateKey(new Date());

  const todosByDate = new Map<string, Todo[]>();
  for (const todo of todos) {
    if (!todo.deadline) continue;
    const key = dateKey(todo.deadline);
    const dayTodos = todosByDate.get(key) ?? [];
    dayTodos.push(todo);
    todosByDate.set(key, dayTodos);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
        <caption className="sr-only">
          {year}年{month + 1}月のタスク（期限日ごと）
        </caption>
        <thead>
          <tr>
            {weekdays.map((weekday, index) => (
              <th
                key={weekday}
                scope="col"
                className={`border border-gray-200 bg-gray-50 p-2 text-center text-sm ${index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-gray-700"}`}
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: weekCount }, (_, week) => (
            <tr key={week}>
              {weekdays.map((_, weekday) => {
                const date = new Date(year, month, week * 7 + weekday - firstWeekday + 1);
                const key = dateKey(date);
                const isCurrentMonth = date.getMonth() === month;
                const isToday = key === todayKey;
                const dayTodos = todosByDate.get(key) ?? [];

                return (
                  <td
                    key={key}
                    className={`h-28 border border-gray-200 p-2 align-top ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}`}
                  >
                    <time
                      dateTime={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
                      aria-current={isToday ? "date" : undefined}
                      className={`inline-flex size-7 items-center justify-center rounded-full text-sm ${isToday ? "bg-blue-600 font-bold text-white" : ""}`}
                    >
                      {date.getDate()}
                    </time>
                    <ul className="mt-1 space-y-1">
                      {dayTodos.map((todo) => (
                        <li
                          key={todo.id}
                          className={`rounded border-l-2 p-1 text-xs break-words ${todo.isDone ? "border-gray-400 bg-gray-100 text-gray-500" : categoryColorClasses[todo.category?.color ?? "blue"]}`}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleTodo(todo.id)}
                            aria-label={`${todo.name}を${todo.isDone ? "未完了" : "完了"}にする`}
                            aria-pressed={todo.isDone}
                            className="block w-full rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            <span className={todo.isDone ? "line-through" : ""}>{todo.name}</span>
                            <span className="mt-1 block text-[10px]">
                              優先度：{todo.priority === 1 ? "高" : todo.priority === 2 ? "中" : "低"}
                            </span>
                            {todo.category && <span className="mt-1 block text-[10px]">{todo.category.name}</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarGrid;
