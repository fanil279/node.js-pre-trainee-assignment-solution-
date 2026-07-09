import React from 'react';
import { TodoListProps } from '../../types';

export const ToDoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <div>
      <h3>Todo List</h3>

      <ul>
        {todos.length === 0 ? (
          <li>No todos available.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} >
              <span>{todo.title}</span> -{" "}
              <span>{todo.completed ? "Completed" : "Not completed"}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
