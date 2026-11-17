import type { Category, Todo, ThemeColor } from "./types.ts";

export const STORAGE_KEY = "calendar-todo-app:v1";
export type AppData = { todos: Todo[]; categories: Category[] };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isColor = (value: unknown): value is ThemeColor =>
  value === "blue" || value === "green" || value === "red" || value === "yellow" || value === "purple";

// JSONでは日時が文字列になるため、読み込み時にDateへ戻す。
export const deserializeData = (json: string): AppData => {
  const value: unknown = JSON.parse(json);
  if (!isRecord(value) || !Array.isArray(value.categories) || !Array.isArray(value.todos)) {
    throw new Error("保存データの形式が正しくありません。");
  }
  const categories: Category[] = value.categories.map((category: unknown) => {
    if (
      !isRecord(category) ||
      typeof category.id !== "string" ||
      typeof category.name !== "string" ||
      typeof category.description !== "string" ||
      !isColor(category.color)
    ) {
      throw new Error("カテゴリの保存データが正しくありません。");
    }
    return { id: category.id, name: category.name, description: category.description, color: category.color };
  });
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const todos: Todo[] = value.todos.map((todo: unknown) => {
    if (
      !isRecord(todo) ||
      typeof todo.id !== "string" ||
      typeof todo.name !== "string" ||
      typeof todo.isDone !== "boolean" ||
      typeof todo.priority !== "number" ||
      !Number.isInteger(todo.priority) ||
      todo.priority < 1 ||
      todo.priority > 3 ||
      !(todo.deadline === null || typeof todo.deadline === "string") ||
      !(todo.category === null || (isRecord(todo.category) && typeof todo.category.id === "string"))
    ) {
      throw new Error("タスクの保存データが正しくありません。");
    }
    const deadline = todo.deadline === null ? null : new Date(todo.deadline);
    if (deadline && Number.isNaN(deadline.getTime())) throw new Error("期限の保存データが正しくありません。");
    return {
      id: todo.id,
      name: todo.name,
      isDone: todo.isDone,
      priority: todo.priority,
      deadline,
      category: isRecord(todo.category) ? (categoriesById.get(String(todo.category.id)) ?? null) : null,
    };
  });
  if (
    new Set(categories.map((category) => category.id)).size !== categories.length ||
    new Set(todos.map((todo) => todo.id)).size !== todos.length
  ) {
    throw new Error("保存データのIDが重複しています。");
  }
  return { todos, categories };
};
