import { useId, useRef, useState, type FormEvent } from "react";
import Dialog from "../../../components/ui/Dialog";
import Icon from "../../../components/ui/Icon";
import type { Category, Todo } from "../../../types/todo";

type Props = {
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, "id" | "isDone">) => void;
};

export default function TodoForm({ categories, onAddTodo }: Props) {
  const formId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  const openDialog = () => {
    setName("");
    setDescription("");
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
      description: description.trim(),
      priority,
      deadline: parsedDeadline,
      category: categories.find((category) => category.id === selectedCategoryId) ?? null,
    });
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        className="list-add-button"
        onClick={openDialog}
        aria-label="タスクを追加"
        title="タスクを追加"
        aria-haspopup="dialog"
      >
        <Icon name="plus" />
      </button>
      <Dialog dialogRef={dialogRef} title="タスクを追加">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label htmlFor={`${formId}-name`}>
              タスク名 <span className="required-label">必須</span>
            </label>
            <input
              id={`${formId}-name`}
              autoFocus
              required
              value={name}
              placeholder="例：プログラミングの復習"
              onChange={(event) => {
                setName(event.target.value);
                setIsNameTouched(true);
              }}
              aria-invalid={showNameError}
              aria-describedby={`${formId}-name-help`}
            />
            <p
              id={`${formId}-name-help`}
              aria-live="polite"
              className={`form-help ${showNameError ? "form-error" : ""}`}
            >
              {showNameError ? nameError : "2〜32文字で入力してください。"}
            </p>
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-description`}>
              説明 <span className="optional-label">任意</span>
            </label>
            <textarea
              id={`${formId}-description`}
              rows={3}
              value={description}
              placeholder="タスクの説明を入力"
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-category`}>カテゴリ</label>
            <select
              id={`${formId}-category`}
              value={selectedCategoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">カテゴリなし</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-deadline`}>
              期限 <span className="optional-label">任意</span>
            </label>
            <input
              id={`${formId}-deadline`}
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              aria-invalid={!!deadlineError}
              aria-describedby={`${formId}-deadline-help`}
            />
            <p id={`${formId}-deadline-help`} className={`form-help ${deadlineError ? "form-error" : ""}`}>
              {deadlineError || "期限を設定するとカレンダーにも表示されます。"}
            </p>
          </div>
          <fieldset className="form-field">
            <legend>優先度</legend>
            <div className="priority-options">
              {[
                { value: 1, label: "高" },
                { value: 2, label: "中" },
                { value: 3, label: "低" },
              ].map((option) => (
                <label key={option.value} className={`priority-option priority-${option.value}`}>
                  <input
                    type="radio"
                    name={`${formId}-priority`}
                    value={option.value}
                    checked={priority === option.value}
                    onChange={() => setPriority(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </button>
            <button type="submit" className="button button-primary" disabled={!!nameError || !!deadlineError}>
              <Icon name="plus" />
              追加する
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
