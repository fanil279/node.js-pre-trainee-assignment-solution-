import React, { useState } from 'react';
import { Todo } from '../../types';

export const AddToDo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [_todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: 1,
      title: inputValue,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputValue('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add Todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
    </div>
  );
};
