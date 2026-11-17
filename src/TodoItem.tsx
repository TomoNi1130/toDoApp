import { categoryColorClasses, type Todo } from "./TS/types";

type Props = {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

const TodoItem = ({ todo, onToggleTodo, onDeleteTodo }: Props) => (
  <li
    className={`flex items-start gap-3 rounded-lg border p-3 ${todo.isDone ? "border-gray-200 bg-gray-50 text-gray-500" : todo.category ? categoryColorClasses[todo.category.color] : "border-gray-200 bg-white text-gray-900"}`}
  >
    <input
      type="checkbox"
      checked={todo.isDone}
      onChange={() => onToggleTodo(todo.id)}
      aria-label={`${todo.name}を${todo.isDone ? "未完了" : "完了"}にする`}
      className="mt-1 size-5 shrink-0 accent-blue-600"
    />
    <div className="min-w-0 flex-1">
      <p className={`break-words font-medium ${todo.isDone ? "line-through" : ""}`}>{todo.name}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <span>{todo.category?.name ?? "カテゴリなし"}</span>
        <span>優先度：{todo.priority === 1 ? "高" : todo.priority === 2 ? "中" : "低"}</span>
        <span>{todo.isDone ? "完了" : "未完了"}</span>
      </div>
      <p className="mt-1 text-xs">
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
      className="shrink-0 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      削除
    </button>
  </li>
);

export default TodoItem;
