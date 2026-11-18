import { useEffect, useState } from "react";
import type { Todo, Category, ThemeColor } from "./TS/types";
import { initTodos, initCategories } from "./TS/initTodos";
import { deserializeData, STORAGE_KEY, type AppData } from "./TS/storage";
import Header from "./header";
import Calendar from "./Calendar/Calendar";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { v4 as uuidv4 } from "uuid";

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

const App = () => {
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

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-10 text-gray-900">
        <div>
          <h2 className="text-xl font-bold">タスクと予定</h2>
          <p role="status" className="mt-1 text-sm text-gray-600">
            未完了 {uncompletedCount}件 ／ 全{todos.length}件
          </p>
        </div>
        {(loadError || saveError) && (
          <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p>
              {loadError
                ? "保存データを読み込めなかったため、初期データを表示しています。変更はまだ保存されません。"
                : "データを保存できませんでした。ブラウザの保存設定や空き容量を確認してください。"}
            </p>
            <button
              type="button"
              onClick={() => {
                setLoadError(false);
                setData((prev) => ({ ...prev }));
              }}
              className="mt-2 rounded border border-red-300 px-3 py-1 underline"
            >
              この内容で保存を再試行
            </button>
          </div>
        )}
        <Calendar
          todos={todos}
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onChangeCategoryColor={changeCategoryColor}
        />
        <TodoForm categories={categories} onAddTodo={addTodo} />
        <TodoList
          todos={todos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onDeleteCompleted={deleteCompleted}
        />
        <p className="text-xs text-gray-500">タスクとカテゴリは、このブラウザに自動保存されます。</p>
      </main>
    </>
  );
};

export default App;
