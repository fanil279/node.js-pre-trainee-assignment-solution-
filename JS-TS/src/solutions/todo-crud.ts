import { mapArray, filterArray } from './array-helpers.ts';
import type { Todo } from '../solutions/types.ts';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
    return [...state, todo];
}

export function updateTodo(
    state: Todo[],
    id: number,
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>,
): Todo[] {
    if (!state.some((todo) => todo.id === id)) {
        throw new Error('updateTodo: not implemented');
    }

    return mapArray(state, (todo) => {
        if (todo.id === id) {
            return { ...todo, ...update };
        }

        return todo;
    });
}

export function removeTodo(state: Todo[], id: number): Todo[] {
    if (!state.some((todo) => todo.id === id)) {
        throw new Error('removeTodo: not implemented');
    }

    return filterArray(state, (todo) => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
    return state.find((todo) => todo.id === id);
}
