import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Category, Todo } from "./TS/types";

type Props = {
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, "id" | "isDone">) => void;
};

const TodoForm = ({ categories, onAddTodo }: Props) => {
  const formId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState(3);
  const [deadline, setDeadline] = useState("");
  const [isNameTouched, setIsNameTouched] = useState(false);
  const trimmedName = name.trim();
  const nameError =
    trimmedName.length < 2 || trimmedName.length > 32
      ? "前後の空白を除いて、2文字以上、32文字以内で入力してください。"
      : "";
  const showNameError = isNameTouched && !!nameError;
  const parsedDeadline = deadline ? new Date(deadline) : null;
  const deadlineError =
    parsedDeadline && Number.isNaN(parsedDeadline.getTime()) ? "有効な日時を入力してください。" : "";
  const selectedCategoryId = categories.some((category) => category.id === categoryId) ? categoryId : "";
  const inputClass =
    "w-full min-w-0 rounded border border-gray-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-600";

  const openAddTodoDialog = () => {
    setName("");
    setCategoryId("");
    setPriority(3);
    setDeadline("");
    setIsNameTouched(false);
    dialogRef.current?.showModal();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsNameTouched(true);
    if (nameError || deadlineError) return;
    onAddTodo({
      name: trimmedName,
      priority,
      deadline: parsedDeadline,
      category: categories.find((category) => category.id === selectedCategoryId) ?? null,
    });
    dialogRef.current?.close();
  };

  return (
    <div>
      <button
        type="button"
        onClick={openAddTodoDialog}
        aria-haspopup="dialog"
        aria-controls={`${formId}-dialog`}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
      >
        ＋ タスクを追加
      </button>

      <dialog
        ref={dialogRef}
        id={`${formId}-dialog`}
        aria-labelledby={`${formId}-heading`}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 id={`${formId}-heading`} className="text-lg font-bold">
            タスクを追加
          </h2>
          <div>
            <label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium">
              タスク名（必須）
            </label>
            <input
              id={`${formId}-name`}
              autoFocus
              value={name}
              required
              placeholder="例：プログラミングの復習"
              onChange={(event) => {
                setName(event.target.value);
                setIsNameTouched(true);
              }}
              aria-invalid={showNameError}
              aria-describedby={`${formId}-name-help`}
              className={inputClass}
            />
            <p
              id={`${formId}-name-help`}
              aria-live="polite"
              className={`mt-1 text-sm ${showNameError ? "text-red-600" : "text-gray-500"}`}
            >
              {showNameError ? nameError : "2〜32文字で入力してください。"}
            </p>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={`${formId}-category`} className="mb-1 block text-sm font-medium">
                カテゴリ
              </label>
              <select
                id={`${formId}-category`}
                value={selectedCategoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className={inputClass}
              >
                <option value="">カテゴリなし</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor={`${formId}-deadline`} className="mb-1 block text-sm font-medium">
                期限（任意）
              </label>
              <input
                id={`${formId}-deadline`}
                type="datetime-local"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                aria-invalid={!!deadlineError}
                aria-describedby={`${formId}-deadline-help`}
                className={inputClass}
              />
              <p id={`${formId}-deadline-help`} className="mt-1 text-xs text-gray-500">
                {deadlineError || "期限を設定するとカレンダーにも表示されます。"}
              </p>
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">優先度</legend>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 1, label: "高" },
                { value: 2, label: "中" },
                { value: 3, label: "低" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`${formId}-priority`}
                    value={option.value}
                    checked={priority === option.value}
                    onChange={() => setPriority(option.value)}
                    className="accent-blue-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!!nameError || !!deadlineError}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              追加する
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TodoForm;
