import { type Todo, TodoStatus } from '../solutions/types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
    return state.map((todo) => {
        return completed
            ? { ...todo, status: TodoStatus.COMPLETED }
            : { ...todo, status: TodoStatus.PENDING };
    });
}

export function clearCompleted(state: Todo[]): Todo[] {
    return state.filter((todo) => todo.status !== TodoStatus.COMPLETED);
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
    return state.reduce((acc, todo) => {
        return todo.status === status ? acc + 1 : acc;
    }, 0);
}
