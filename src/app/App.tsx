import { useEffect, useRef, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Calendar from "../features/calendar/components/Calendar";
import CategoryPanel from "../features/categories/components/CategoryPanel";
import TodoDetails from "../features/todos/components/TodoDetails";
import TodoList from "../features/todos/components/TodoList";
import { useTodoStore } from "../features/todos/hooks/useTodoStore";
import type { TodoFormHandle } from "../features/todos/components/TodoForm";

export default function App() {
  const store = useTodoStore();
  const { todos, categories } = store;
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const selectedTodo = todos.find((todo) => todo.id === selectedTodoId);
  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  const editFormRef = useRef<TodoFormHandle>(null);
  const addFormRef = useRef<TodoFormHandle>(null);

  const [editRequest, setEditRequest] = useState<{
    id: string;
  } | null>(null);

  const startEditing = (id: string) => {
    setSelectedTodoId(id);
    setEditRequest({ id });
  };

  const startAdding = (date: Date) => {
    addFormRef.current?.open(date);
  };

  useEffect(() => {
    if (editRequest) {
      editFormRef.current?.open();
    }
  }, [editRequest]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        メインコンテンツへ
      </a>
      <Header />
      <main id="main-content" className="app-main">
        <div className="page-heading">
          <div>
            <h1>タスクと予定</h1>
            <p role="status" className="page-description">
              未完了 {uncompletedCount}件 ／ 全{todos.length}件
            </p>
          </div>
        </div>

        {(store.loadError || store.saveError) && (
          <div role="alert" className="storage-alert">
            <p>
              {store.loadError
                ? "保存データを読み込めなかったため、初期データを表示しています。変更はまだ保存されません。"
                : "データを保存できませんでした。ブラウザの保存設定や空き容量を確認してください。"}
            </p>
            <button type="button" className="button button-secondary" onClick={store.retrySave}>
              この内容で保存を再試行
            </button>
          </div>
        )}

        <div className="workspace">
          <Calendar
            todos={todos}
            onSelectTodo={setSelectedTodoId}
            onEditTodo={startEditing}
            onAddTodoAtDate={startAdding}
          />
          <aside className="workspace-sidebar" aria-label="タスクとカテゴリの管理">
            {selectedTodo && (
              <TodoDetails
                editFormRef={editFormRef}
                todo={selectedTodo}
                categories={categories}
                onUpdateTodo={store.updateTodo}
                onClose={() => setSelectedTodoId(null)}
              />
            )}
            <div className="sidebar-categories" hidden={!!selectedTodo}>
              <CategoryPanel
                categories={categories}
                onAddCategory={store.addCategory}
                onDeleteCategory={store.deleteCategory}
                onChangeCategoryColor={store.changeCategoryColor}
              />
            </div>
            <TodoList
              todos={todos}
              categories={categories}
              addFormRef={addFormRef}
              onAddTodo={store.addTodo}
              onSelectTodo={setSelectedTodoId}
              onEditTodo={startEditing}
              onToggleTodo={store.toggleTodo}
              onDeleteTodo={store.deleteTodo}
              onDeleteCompleted={store.deleteCompleted}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
