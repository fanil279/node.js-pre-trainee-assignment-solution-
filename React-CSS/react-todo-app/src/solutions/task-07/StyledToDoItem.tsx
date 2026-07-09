import React from 'react';
import { TodoItemProps } from '../../types';
import styles from './StyledToDoItem.module.css';

export const StyledToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <div
      className={`${styles['todo-item']} ${
        todo.completed ? styles.completed : ''
      }`}
    >
      <h3>{todo.title}</h3>

      <p>{todo.completed ? 'Completed' : 'Active'}</p>
    </div>
  );
};
