import React, { useState, useEffect } from 'react';
import { Todo } from '../../types';

export const FetchToDos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /*
         * When a React component unmounts (e.g., the user navigates away) while a fetch is still running,
         * the network request keeps downloading in the background. When it finishes, React will try to update
         * the state of a component that no longer exists, which can cause memory leaks, bugs, and sluggish performance.
         */
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const url = 'https://jsonplaceholder.typicode.com/todos';

                // Passes the controller's signal to the fetch options.
                // This connects this specific fetch request to our controller.
                const response = await fetch(url, { signal: controller.signal });

                const data = await response.json();

                setTodos(data.slice(0, 5));
            } catch (error: any) {
                // When a fetch is aborted, it automatically throws an error.
                // I check the error name so that a fake error message is not dispalyed to the user.
                if (error.name !== 'AbortError') {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Calling abort() instantly cancels the ongoing fetch request over the network.
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
