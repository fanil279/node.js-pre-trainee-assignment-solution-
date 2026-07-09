import React, { useState, useEffect } from 'react';
import { Todo } from '../../types';

export const FetchToDos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const url = 'https://jsonplaceholder.typicode.com/todos';

                const response = await fetch(url, { signal: controller.signal });

                const data = await response.json();

                setTodos(data.slice(0, 5));
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, []);

    if (loading) {
        return <h4>Loading</h4>;
    }

    if (error) {
        return <h4>{error}</h4>;
    }

    return (
        <div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <h4>{todo.title}</h4>
                        <p>{todo.completed ? 'Completed' : 'Active'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
