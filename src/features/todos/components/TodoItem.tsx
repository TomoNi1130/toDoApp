import { categoryColorClasses, priorityLabels, type Todo } from "../../../types/todo";

type Props = {
  todo: Todo;
  onSelectTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

export default function TodoItem({ todo, onSelectTodo, onToggleTodo, onDeleteTodo }: Props) {
  return (
    <li className={`todo-item ${todo.isDone ? "is-complete" : ""}`}>
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggleTodo(todo.id)}
        aria-label={`${todo.name}を${todo.isDone ? "未完了" : "完了"}にする`}
        className="todo-checkbox"
      />
      <div className="todo-content">
        <p className="todo-name">
          <button
            type="button"
            className="todo-select-button"
            onClick={() => onSelectTodo(todo.id)}
            aria-label={`${todo.name}の詳細を表示`}
          >
            {todo.name}
          </button>
        </p>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        <div className="todo-meta">
          <span className={`category-tag ${todo.category ? categoryColorClasses[todo.category.color] : ""}`}>
            {todo.category?.name ?? "カテゴリなし"}
          </span>
          <span className={`priority priority-${todo.priority}`}>優先度：{priorityLabels[todo.priority]}</span>
          <span className="todo-status">{todo.isDone ? "完了" : "未完了"}</span>
        </div>
        <p className="todo-deadline">
          {todo.deadline ? (
            <time dateTime={todo.deadline.toISOString()}>
              期限：
              {todo.deadline.toLocaleString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          ) : (
            "期限未設定"
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDeleteTodo(todo.id)}
        aria-label={`${todo.name}を削除`}
        className="text-delete-button"
      >
        削除
      </button>
    </li>
  );
}
