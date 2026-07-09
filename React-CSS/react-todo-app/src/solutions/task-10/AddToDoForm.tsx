import React, { useState } from 'react';
import { Todo } from '../../types';

export const AddToDoForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const newTodo: Todo = {
            id: todos.length + 1,
            title: title.trim(),
            completed: false,
        };

        setTodos((prev) => [...prev, newTodo]);
        setTitle('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Add Todo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.title} - {todo.completed ? 'Completed' : 'Active'}
                    </li>
                ))}
            </ul>
        </div>
    );
};
