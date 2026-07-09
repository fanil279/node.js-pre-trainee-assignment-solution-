import React, { useState } from 'react';
import { Todo } from '../../types';

export const CompleteToDoList: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);

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
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo)),
        );
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
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.title} - {todo.completed ? 'completed' : 'not completed'}
                        <button
                            style={{ marginLeft: '1rem' }}
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
