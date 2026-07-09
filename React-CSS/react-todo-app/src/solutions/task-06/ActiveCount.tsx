import React from 'react';
import { ActiveCountProps } from '../../types';

export const ActiveCount: React.FC<ActiveCountProps> = ({ todos }) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  if (todos.length === 0) {
    return <h1>No todos</h1>;
  }

  return (
    <div>
      {activeCount > 0 ? (
        <h1>
          {`${activeCount} active ${activeCount === 1 ? 'todo' : 'todos'}`}
        </h1>
      ) : (
        <h1>All todos completed!</h1>
      )}
    </div>
  );
};
