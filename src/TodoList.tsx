import type { Todo } from "./TS/types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteCompleted: () => void;
};

const TodoList = ({ todos, onToggleTodo, onDeleteTodo, onDeleteCompleted }: Props) => {
  const completedCount = todos.filter((todo) => todo.isDone).length;
  return (
    <section
      aria-labelledby="todo-list-heading"
      className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="todo-list-heading" className="text-lg font-bold">
          タスク一覧
        </h2>
        <button
          type="button"
          disabled={completedCount === 0}
          onClick={() => {
            if (window.confirm(`完了済みのタスク${completedCount}件を削除しますか？`)) onDeleteCompleted();
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
        >
          完了済みを削除（{completedCount}件）
        </button>
      </div>
      {todos.length === 0 ? (
        <p className="text-sm text-gray-600">現在、登録されているタスクはありません。上のフォームから追加できます。</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} onDeleteTodo={onDeleteTodo} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default TodoList;
