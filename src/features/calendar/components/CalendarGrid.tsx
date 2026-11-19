import { categoryColorClasses, priorityLabels, type Todo } from "../../../types/todo";
import { dateKey, getMonthDays } from "../utils/dates";

type Props = {
  displayMonth: Date;
  todos: Todo[];
  onSelectTodo: (id: string) => void;
};

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarGrid({ displayMonth, todos, onSelectTodo }: Props) {
  const days = getMonthDays(displayMonth);
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
    <div className="calendar-scroll" role="region" aria-label="月間カレンダー（横スクロール可能）" tabIndex={0}>
      <table className="calendar-table">
        <caption className="sr-only">
          {displayMonth.getFullYear()}年{displayMonth.getMonth() + 1}月のタスク（期限日ごと）
        </caption>
        <thead>
          <tr>
            {weekdays.map((weekday, index) => (
              <th key={weekday} scope="col" className={index === 0 ? "is-sunday" : index === 6 ? "is-saturday" : ""}>
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: days.length / 7 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((date) => {
                const key = dateKey(date);
                const isToday = key === todayKey;
                const dayTodos = todosByDate.get(key) ?? [];
                return (
                  <td
                    key={key}
                    className={`${date.getMonth() !== displayMonth.getMonth() ? "outside-month" : ""} ${isToday ? "today-cell" : ""}`}
                  >
                    <time
                      dateTime={key}
                      aria-current={isToday ? "date" : undefined}
                      className={`day-number ${isToday ? "is-today" : ""}`}
                    >
                      {date.getDate()}
                    </time>
                    {dayTodos.length > 0 && (
                      <ul className="calendar-events">
                        {dayTodos.map((todo) => (
                          <li key={todo.id}>
                            <button
                              type="button"
                              onClick={() => onSelectTodo(todo.id)}
                              aria-label={`${todo.name}の詳細を表示`}
                              className={`calendar-event ${categoryColorClasses[todo.category?.color ?? "blue"]} ${todo.isDone ? "is-complete" : ""}`}
                            >
                              <span className="event-name">{todo.name}</span>
                              <span className="event-meta">優先度：{priorityLabels[todo.priority]}</span>
                              {todo.category && <span className="event-meta">{todo.category.name}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
