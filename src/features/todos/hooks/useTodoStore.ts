import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Todo, Category, ThemeColor } from "../../../types/todo";
import { initTodos, initCategories } from "../../../data/initialData";
import { deserializeData, STORAGE_KEY, type AppData } from "../../../lib/storage";

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return {
      data: saved === null ? { todos: initTodos, categories: initCategories } : deserializeData(saved),
      error: false,
    };
  } catch {
    return { data: { todos: initTodos, categories: initCategories }, error: true };
  }
};

export const useTodoStore = () => {
  const [initial] = useState(loadData);
  const [data, setData] = useState<AppData>(initial.data);
  const [loadError, setLoadError] = useState(initial.error);
  const [saveError, setSaveError] = useState(false);
  const { todos, categories } = data;

  useEffect(() => {
    // 読み込めなかったデータは、ユーザーが保存を再開するまで上書きしない。
    if (loadError) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // 外部ストレージの保存結果を画面に通知するため、ここで状態を更新する。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [data, loadError]);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: uuidv4() };
    setData((prev) => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const changeCategoryColor = (categoryId: string, color: ThemeColor) => {
    setData((prev) => ({
      categories: prev.categories.map((category) => (category.id === categoryId ? { ...category, color } : category)),
      todos: prev.todos.map((todo) =>
        todo.category?.id === categoryId ? { ...todo, category: { ...todo.category, color } } : todo,
      ),
    }));
  };

  const deleteCategory = (categoryId: string) => {
    setData((prev) => ({
      categories: prev.categories.filter((category) => category.id !== categoryId),
      todos: prev.todos.map((todo) => (todo.category?.id === categoryId ? { ...todo, category: null } : todo)),
    }));
  };

  const addTodo = (todo: Omit<Todo, "id" | "isDone">) => {
    const newTodo = { ...todo, id: uuidv4(), isDone: false };
    setData((prev) => ({ ...prev, todos: [...prev.todos, newTodo] }));
  };

  const toggleTodo = (id: string) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo)),
    }));
  };

  const deleteTodo = (id: string) => {
    setData((prev) => ({ ...prev, todos: prev.todos.filter((todo) => todo.id !== id) }));
  };

  const deleteCompleted = () => {
    setData((prev) => ({ ...prev, todos: prev.todos.filter((todo) => !todo.isDone) }));
  };

  const retrySave = () => {
    setLoadError(false);
    setData((previous) => ({ ...previous }));
  };

  return {
    todos,
    categories,
    loadError,
    saveError,
    retrySave,
    addCategory,
    changeCategoryColor,
    deleteCategory,
    addTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
  };
};
