import { type Todo, type NewTodo, TodoStatus } from './types.ts';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
    return {
        id: nextId++,
        title: input.title,
        description: input.description,
        status: TodoStatus.PENDING,
        createdAt: new Date(),
    } as Todo;
}
