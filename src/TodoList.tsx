import { categoryColorClasses, type Todo } from "./TS/types";

type Props = {
  todos: Todo[];
};

const TodoList = (props: Props) => {
  const todos = props.todos;

  if (todos.length === 0) {
    return <p className="text-red-500">現在、登録されているタスクはありません。</p>;
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div key={todo.id} className={`rounded border p-3 ${categoryColorClasses[todo.category?.color ?? "blue"]}`}>
          name : {todo.name}
          <br />
          isDone : {todo.isDone ? "true" : "false"}
          <br />
          category : {todo.category ? todo.category.name : "null"}
          <br />
          deadline : {todo.deadline ? todo.deadline.toISOString() : "null"}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
