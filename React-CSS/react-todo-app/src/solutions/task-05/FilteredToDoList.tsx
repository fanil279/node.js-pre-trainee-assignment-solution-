import React, { useState } from 'react';
import { Todo } from '../../types';

export const FilteredToDoList: React.FC = () => {
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
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo)),
        );
    };

    const handleFilter = (filter: 'all' | 'active' | 'completed') => {
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
                <button type="submit">Add</button>
            </form>

            <div style={{ marginTop: '1rem' }}>
                <button onClick={() => handleFilter('all')}>All</button>
                <button onClick={() => handleFilter('active')}>Active</button>
                <button onClick={() => handleFilter('completed')}>Completed</button>
            </div>

            <ul>
                {filteredTodos.map((todo) => (
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
