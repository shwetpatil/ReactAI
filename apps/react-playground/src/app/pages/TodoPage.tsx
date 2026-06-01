import { useState } from 'react';
import { Todo } from '../Components/ToDo/Todo';

export function TodoPage() {
  const [todos, setTodos] = useState<string[]>([]);

  const onAddTodo = (todo: string) => {
    setTodos((prev) => [...prev, todo]);
  };

  const onDeleteTodo = (todoToDelete: string) => {
    setTodos((prev) =>
      prev.filter((todo) => todo !== todoToDelete)
    );
  };

  return (
    <>
      <h1>Todo Demo</h1>

      <Todo
        todoList={todos}
        onAddTodo={onAddTodo}
        onDeleteTodo={onDeleteTodo}
      />
    </>
  );
}

export default TodoPage;