import { TodoApi } from './todo-api';
import { type Todo, TodoStatus } from './types';

export class TodoService {
    constructor(private readonly api: TodoApi) {}

    async create(title: string, description = ''): Promise<Todo> {
        if (!title.trim()) {
            throw new Error('Title cannot be empty');
        }

        return this.api.add({ title, description });
    }

    async toggleStatus(id: number): Promise<Todo> {
        const todos = await this.api.getAll();
        const todo = todos.find((todo) => todo.id === id);

        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }

        const newStatus =
            todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;

        return this.api.update(id, { status: newStatus });
    }

    async search(keyword: string): Promise<Todo[]> {
        const query = keyword.trim().toLowerCase();

        if (!query) {
            throw new Error('Keyword cannot be empty');
        }

        const todos = await this.api.getAll();

        return todos.filter(
            (todo) =>
                todo.title.toLowerCase().includes(query) ||
                todo.description?.toLowerCase().includes(query),
        );
    }
}
