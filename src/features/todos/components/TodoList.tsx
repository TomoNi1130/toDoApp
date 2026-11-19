import type { Ref } from "react";
import Icon from "../../../components/ui/Icon";
import type { Category, Todo } from "../../../types/todo";
import TodoForm, { type TodoFormHandle } from "./TodoForm";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, "id" | "isDone">) => void;
  onSelectTodo: (id: string) => void;
  onEditTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteCompleted: () => void;
  addFormRef: Ref<TodoFormHandle>;
};

export default function TodoList({
  todos,
  categories,
  onAddTodo,
  onSelectTodo,
  onEditTodo,
  onToggleTodo,
  onDeleteTodo,
  onDeleteCompleted,
  addFormRef,
}: Props) {
  const completedCount = todos.filter((todo) => todo.isDone).length;
  return (
    <section aria-labelledby="todo-list-heading" className="panel task-panel">
      <div className="panel-heading">
        <h2 id="todo-list-heading">
          <Icon name="tasks" />
          タスク一覧
        </h2>
        <button
          type="button"
          disabled={completedCount === 0}
          className="text-delete-button"
          onClick={() => {
            if (window.confirm(`完了済みのタスク${completedCount}件を削除しますか？`)) onDeleteCompleted();
          }}
        >
          完了済みを削除（{completedCount}件）
        </button>
      </div>
      {todos.length === 0 ? (
        <p className="empty-state">現在、登録されているタスクはありません。下の「＋」から追加できます。</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onSelectTodo={onSelectTodo}
              onEditTodo={onEditTodo}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
      <div className="list-actions">
        <TodoForm ref={addFormRef} categories={categories} onSubmitTodo={onAddTodo} onEditTodo={onEditTodo} />
      </div>
    </section>
  );
}
