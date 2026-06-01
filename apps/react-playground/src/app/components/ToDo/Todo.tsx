import { useState } from 'react';
import styles from './Todo.module.css';

type TodoProps = {
  todoList: string[];
  onAddTodo: (todo: string) => void;
  onDeleteTodo: (todo: string) => void;
};

export function Todo({
  todoList,
  onAddTodo,
  onDeleteTodo,
}: TodoProps) {
  const [todoText, setTodoText] = useState('');

  return (
    <div className={styles.container}>
      <input
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        placeholder="Enter todo"
      />

      <button
        onClick={() => {
          onAddTodo(todoText);
          setTodoText('');
        }}
      >
        Add
      </button>

      {todoList.map((item, index) => (
        <div key={index}>
          <span>{item}</span>

          <button onClick={() => onDeleteTodo(item)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Todo;