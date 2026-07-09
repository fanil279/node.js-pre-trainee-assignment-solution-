import React from 'react';
import { TodoItemProps } from '../../types';

export const ToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <div>
      <div
        style={{
          padding: '8px',
          marginBottom: '8px',
          border: '1px solid #ccc',
          backgroundColor: todo.completed ? '#d4edda' : '#f8d7da',
        }}
      >

      <h4>{todo.title}</h4>

      <p>
        Status:{' '}

        <strong>
          {todo.completed ? 'Completed' : 'Not completed'}
        </strong>
      </p>
      </div>
    </div>
  );
};
