import React, { useState } from 'react';
import { Todo } from '../../types';

export const FilteredToDoList: React.FC = () => {
  // 1. Display a list of todos with add functionality
  // 2. Add filter buttons: "All", "Active", "Completed"
  // 3. Filter todos based on selected filter
  // 4. Use derived state for filtered results
  // 5. Add complete functionality for todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: todos.length + 1,
      title: inputValue,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputValue('');
  };

  const markCompleted = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: true }
          : todo
      )
    );
  };
  
  const handleFilter = (
    filter: "all" | "active" | "completed"
  ) => {
    setFilter(filter);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;

    return true;
  });

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

      <button onClick={() => handleFilter(filter)}>All</button>
      <button onClick={() => handleFilter(filter)}>Active</button>
      <button onClick={() => handleFilter(filter)}>Completed</button>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? "completed" : "not completed"}

            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => markCompleted(todo.id)}
              disabled={todo.completed}
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
