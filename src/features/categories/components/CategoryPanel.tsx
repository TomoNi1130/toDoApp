import { useId, useRef, useState, type FormEvent } from "react";
import Dialog from "../../../components/ui/Dialog";
import Icon from "../../../components/ui/Icon";
import { categoryColorClasses, colorOptions, type Category, type ThemeColor } from "../../../types/todo";

type Props = {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onDeleteCategory: (id: string) => void;
  onChangeCategoryColor: (id: string, color: ThemeColor) => void;
};

export default function CategoryPanel({ categories, onAddCategory, onDeleteCategory, onChangeCategoryColor }: Props) {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formId = useId();
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({ name: "", description: "", color: "blue" });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newCategory.name.trim()) return;
    onAddCategory({ ...newCategory, name: newCategory.name.trim(), description: newCategory.description.trim() });
    dialogRef.current?.close();
  };

  return (
    <section className="panel category-panel" aria-labelledby="category-heading">
      <div className="panel-heading">
        <h2 id="category-heading">
          <Icon name="categories" />
          カテゴリ
        </h2>
      </div>
      <p className="section-hint">カテゴリをクリックして色を変更</p>
      {categories.length === 0 ? (
        <p className="category-empty">カテゴリはありません。</p>
      ) : (
        <ul className="category-list">
          {categories.map((category) => {
            const isEditing = editingCategoryId === category.id;
            return (
              <li key={category.id}>
                <div className="category-row">
                  <button
                    type="button"
                    className={`category-select ${categoryColorClasses[category.color]}`}
                    aria-expanded={isEditing}
                    aria-label={`${category.name}の色を変更（現在：${colorOptions.find((option) => option.value === category.color)?.label}）`}
                    aria-controls={`category-colors-${category.id}`}
                    onClick={() => setEditingCategoryId(isEditing ? null : category.id)}
                  >
                    <span className="category-dot" />
                    <span className="category-name">{category.name}</span>
                    <span className="category-color-label">
                      {colorOptions.find((option) => option.value === category.color)?.label}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="text-delete-button"
                    aria-label={`${category.name}を削除`}
                    onClick={() => {
                      if (
                        window.confirm(
                          `カテゴリ「${category.name}」を削除しますか？\nタスクは残り、カテゴリなしになります。`,
                        )
                      )
                        onDeleteCategory(category.id);
                    }}
                  >
                    削除
                  </button>
                </div>
                {isEditing && (
                  <div
                    id={`category-colors-${category.id}`}
                    role="group"
                    aria-label={`${category.name}のテーマカラー`}
                    className="color-options"
                  >
                    {colorOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`color-swatch ${categoryColorClasses[option.value]}`}
                        aria-label={`${category.name}を${option.label}に変更`}
                        aria-pressed={category.color === option.value}
                        onClick={() => onChangeCategoryColor(category.id, option.value)}
                      >
                        <span className="category-dot" />
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
      <div className="list-actions">
        <button
          type="button"
          className="list-add-button"
          aria-label="カテゴリを追加"
          title="カテゴリを追加"
          aria-haspopup="dialog"
          onClick={() => {
            setNewCategory({ name: "", description: "", color: "blue" });
            dialogRef.current?.showModal();
          }}
        >
          <Icon name="plus" />
        </button>
      </div>
      <Dialog dialogRef={dialogRef} title="カテゴリを追加">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label htmlFor={`${formId}-name`}>
              カテゴリ名 <span className="required-label">必須</span>
            </label>
            <input
              id={`${formId}-name`}
              autoFocus
              required
              value={newCategory.name}
              placeholder="例：趣味"
              onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-description`}>
              説明 <span className="optional-label">任意</span>
            </label>
            <textarea
              id={`${formId}-description`}
              rows={3}
              value={newCategory.description}
              placeholder="カテゴリの説明を入力"
              onChange={(event) => setNewCategory({ ...newCategory, description: event.target.value })}
            />
          </div>
          <fieldset className="form-field">
            <legend>テーマカラー</legend>
            <div className="color-options">
              {colorOptions.map((option) => (
                <label key={option.value} className={`color-swatch ${categoryColorClasses[option.value]}`}>
                  <input
                    type="radio"
                    name={`${formId}-color`}
                    value={option.value}
                    checked={newCategory.color === option.value}
                    onChange={() => setNewCategory({ ...newCategory, color: option.value })}
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
            <button type="submit" className="button button-primary" disabled={!newCategory.name.trim()}>
              <Icon name="plus" />
              追加する
            </button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}
