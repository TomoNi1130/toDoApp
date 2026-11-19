import type { Todo } from "../../../types/todo";

type Props = { todo: Todo; onClose: () => void };

export default function TodoDetails({ todo, onClose }: Props) {
  return (
    <section className="panel detail-panel" aria-label="タスク詳細">
      <h3>{todo.name}</h3>
      <dl className="todo-details">
        <div>
          <dt>説明：</dt>
          <dd className="todo-description">{todo.description || "説明はありません。"}</dd>
        </div>
        <div>
          <dt>状態：</dt>
          <dd>{todo.isDone ? "完了" : "未完了"}</dd>
        </div>
        <div>
          <dt>カテゴリ：</dt>
          <dd>{todo.category?.name ?? "なし"}</dd>
        </div>
        <div>
          <dt>期限：</dt>
          <dd>{todo.deadline?.toLocaleDateString("ja-JP") ?? "未設定"}</dd>
        </div>
      </dl>
      <button type="button" onClick={onClose} className="button button-secondary">
        閉じる
      </button>
    </section>
  );
}
