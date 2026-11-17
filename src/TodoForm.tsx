import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Category, Todo } from "./TS/types";

type Props = {
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, "id" | "isDone">) => void;
};

const TodoForm = ({ categories, onAddTodo }: Props) => {
  const formId = useId();
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
    setName("");
    setCategoryId("");
    setPriority(3);
    setDeadline("");
    setIsNameTouched(false);
  };

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900"
      aria-labelledby={`${formId}-heading`}
    >
      <h2 id={`${formId}-heading`} className="text-lg font-bold">
        新しいタスク
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium">
            タスク名（必須）
          </label>
          <input
            id={`${formId}-name`}
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
        <button
          type="submit"
          disabled={!!nameError || !!deadlineError}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
        >
          タスクを追加
        </button>
      </form>
    </section>
  );
};

export default TodoForm;
