import { createTodo } from './todo-factory.ts';
import { InMemoryRepository } from './repository.ts';
import type { Todo, NewTodo } from './types.ts';

export const getRandomDelay = (): number => {
    return Math.floor(Math.random() * 301) + 300;
};

export class TodoApi {
    private repository = new InMemoryRepository<Todo>();
    private delay = async (ms: number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };

    async getAll(): Promise<Todo[]> {
        await this.delay(getRandomDelay());
        return this.repository.findAll();
    }

    async add(newTodo: NewTodo): Promise<Todo> {
        await this.delay(getRandomDelay());

        const todo = createTodo(newTodo);

        return this.repository.add(todo);
    }

    async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
        await this.delay(getRandomDelay());
        return this.repository.update(id, update);
    }

    async remove(id: number): Promise<void> {
        await this.delay(getRandomDelay());
        return this.repository.remove(id);
    }
}
