import { type Todo, type NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
    return {
        id: nextId++,
        title: input.title,
        ...(input.description !== undefined && {
            description: input.description
        }),
        status: TodoStatus.PENDING,
        createdAt: new Date(),
    };
}
