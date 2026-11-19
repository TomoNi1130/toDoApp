import type { AppData } from "../../../lib/storage.ts";
import type { Category } from "../../../types/todo.ts";

// Todoにもカテゴリ情報を持つため、カテゴリと関連タスクを同時に更新する。
export const updateCategoryData = (data: AppData, id: string, fields: Omit<Category, "id">): AppData => {
  if (!data.categories.some((category) => category.id === id)) return data;

  const updatedCategory: Category = { ...fields, id };

  return {
    ...data,
    categories: data.categories.map((category) => (category.id === id ? updatedCategory : category)),
    todos: data.todos.map((todo) => (todo.category?.id === id ? { ...todo, category: updatedCategory } : todo)),
  };
};
