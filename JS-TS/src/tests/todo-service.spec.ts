import { TodoApi } from '../solutions/todo-api';
import { TodoService } from '../solutions/todo-service';
import { TodoStatus } from '../solutions/types';

describe('TodoService', () => {
    let api: TodoApi;
    let service: TodoService;

    let title: string;
    let description: string;

    beforeEach(() => {
        jest.useFakeTimers();

        api = new TodoApi();
        service = new TodoService(api);

        title = 'New Todo';
        description = 'This is a new todo';
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('create()', () => {
        it('creates todo', async () => {
            const promise = service.create(title, description);
            await jest.runAllTimersAsync();

            const todo = await promise;

            expect(todo.id).toBe(1);
            expect(todo.title).toBe(title);
            expect(todo.description).toBe(description);
            expect(todo.status).toBe(TodoStatus.PENDING);
            expect(todo.createdAt).toBeInstanceOf(Date);
        });

        it('throws empty title', async () => {
            await expect(service.create('')).rejects.toThrow('Title cannot be empty');
        });
    });

    describe('toggleStatus()', () => {
        it('toggles todo status', async () => {
            const promise = service.create(title, description);
            await jest.runAllTimersAsync();

            const todo = await promise;

            const promise2 = service.toggleStatus(todo.id);
            await jest.runAllTimersAsync();

            const toggledTodo = await promise2;

            expect(toggledTodo.status).toBe(TodoStatus.COMPLETED);
        });

        it('throws missing id', async () => {
            const promise = service.toggleStatus(100);
            const expectation = expect(promise).rejects.toThrow('Todo with id 100 not found');
            await jest.runAllTimersAsync();

            await expectation;
        });
    });

    describe('search()', () => {
        it('searches todos', async () => {
            const p1 = service.create('First Todo', 'This is the first todo');
            const p2 = service.create('Second Todo', 'This is the second todo');
            await jest.runAllTimersAsync();

            await p1;
            await p2;

            const promise = service.search('first');
            await jest.runAllTimersAsync();

            const results = await promise;

            expect(results).toHaveLength(1);
            expect(results[0]!.title).toBe('First Todo');
            expect(results[0]!.description).toBe('This is the first todo');
        });

        it('throws empty keyword', async () => {
            await expect(service.search('')).rejects.toThrow('Keyword cannot be empty');
        });
    });
});
