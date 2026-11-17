import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Category, ThemeColor } from "../TS/types";
import { categoryColorClasses } from "../TS/types";

type NewCategory = Omit<Category, "id">;

type Props = {
  current_categories: Category[];
  onAddCategory: (category: NewCategory) => void;
  onDeleteCategory: (categoryId: Category["id"]) => void;
  onChangeCategoryColor: (categoryId: Category["id"], color: Category["color"]) => void;
};

const colorOptions: { value: ThemeColor; label: string }[] = [
  { value: "blue", label: "青" },
  { value: "green", label: "緑" },
  { value: "red", label: "赤" },
  { value: "yellow", label: "黄" },
  { value: "purple", label: "紫" },
];

const CalendarSideBar = (props: Props) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formId = useId();
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    description: "",
    color: "blue",
  });

  const openAddCategoryDialog = () => {
    setNewCategory({ name: "", description: "", color: "blue" });
    dialogRef.current?.showModal();
  };

  const handleAddCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCategory.name.trim();
    if (!name) return;

    props.onAddCategory({
      ...newCategory,
      name,
      description: newCategory.description.trim(),
    });
    dialogRef.current?.close();
  };

  return (
    <div className="w-full shrink-0 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 md:w-64">
      <h2 className="font-bold">カテゴリ</h2>
      <p className="mt-1 text-xs text-gray-600">カテゴリをクリックして色を変更</p>

      {props.current_categories.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">カテゴリはありません。</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {props.current_categories.map((category) => {
            const isEditing = editingCategoryId === category.id;
            const currentColor = colorOptions.find((option) => option.value === category.color);

            return (
              <li key={category.id}>
                <button
                  type="button"
                  aria-label={`${category.name}の色を変更（現在：${currentColor?.label}）`}
                  aria-expanded={isEditing}
                  aria-controls={`category-colors-${category.id}`}
                  onClick={() => setEditingCategoryId(isEditing ? null : category.id)}
                  className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${categoryColorClasses[category.color]}`}
                >
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-current" />
                  <span className="min-w-0 flex-1 break-words font-medium text-gray-900">{category.name}</span>
                  <span className="shrink-0 text-xs">{currentColor?.label}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `カテゴリ「${category.name}」を削除しますか？\nタスクは残り、カテゴリなしになります。`,
                    );
                    if (!confirmed) return;
                    props.onDeleteCategory(category.id);
                  }}
                  aria-label={`${category.name}を削除`}
                  className="mt-1 text-sm text-red-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  削除
                </button>

                {isEditing && (
                  <div
                    id={`category-colors-${category.id}`}
                    role="group"
                    aria-label={`${category.name}のテーマカラー`}
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-label={`${category.name}を${option.label}に変更`}
                        aria-pressed={category.color === option.value}
                        onClick={() => props.onChangeCategoryColor(category.id, option.value)}
                        className={`rounded border px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${categoryColorClasses[option.value]} ${category.color === option.value ? "ring-2 ring-gray-900 ring-offset-1" : ""}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={openAddCategoryDialog}
        className="mt-4 w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        ＋ カテゴリを追加
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${formId}-title`}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40"
      >
        <form onSubmit={handleAddCategory} className="space-y-5">
          <h2 id={`${formId}-title`} className="text-lg font-bold">
            カテゴリを追加
          </h2>

          <div>
            <label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium">
              カテゴリ名（必須）
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              autoFocus
              required
              value={newCategory.name}
              onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })}
              placeholder="例：趣味"
              className="w-full rounded border border-gray-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-600"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-description`} className="mb-1 block text-sm font-medium">
              説明（任意）
            </label>
            <textarea
              id={`${formId}-description`}
              name="description"
              rows={3}
              value={newCategory.description}
              onChange={(event) => setNewCategory({ ...newCategory, description: event.target.value })}
              placeholder="カテゴリの説明を入力"
              className="w-full resize-y rounded border border-gray-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-600"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">テーマカラー</legend>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm ${categoryColorClasses[option.value]}`}
                >
                  <input
                    type="radio"
                    name="color"
                    value={option.value}
                    checked={newCategory.color === option.value}
                    onChange={() => setNewCategory({ ...newCategory, color: option.value })}
                    className="accent-current"
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
              disabled={!newCategory.name.trim()}
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

export default CalendarSideBar;
