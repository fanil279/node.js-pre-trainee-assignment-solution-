import React from 'react';
import { TodoListProps } from '../../types';

export const ToDoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <div>
      <ul>
        {todos.length === 0 ? (
          <li>No todos available.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} >
              {todo.title} - {todo.completed ? 'completed' : 'not completed'}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
