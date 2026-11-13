import { useState } from "react";
import type { Todo } from "./TS/types";
import { initTodos } from "./TS/initTodos";
import Header from "./header";
import TodoList from "./TodoList";

const App = () => {
  const [todos] = useState<Todo[]>(initTodos);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  return (
    <>
      <Header />
      <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
        <TodoList todos={todos} />
      </div>
    </>
  );
};

export default App;
