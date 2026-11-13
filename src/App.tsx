import { useState } from "react";
import type { Todo, Category } from "./TS/types";
import { initTodos, initCategories } from "./TS/initTodos";
import Header from "./header";
import Calendar from "./Calendar/Calendar";
import TodoList from "./TodoList";

const App = () => {
  const [todos] = useState<Todo[]>(initTodos);
  const [categories] = useState<Category[]>(initCategories);

  return (
    <>
      <Header />

      <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
        <Calendar todos={todos} />
      </div>

      <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
        <TodoList todos={todos} />
      </div>
    </>
  );
};

export default App;
