import { TodoApi } from '../solutions/todo-api';
import { TodoService } from '../solutions/todo-service';
import { TodoStatus } from '../solutions/types';

describe('TodoService', () => {
    let api: TodoApi;
    let service: TodoService;

    let title: string;
    let description: string;

    beforeEach(() => {
        api = new TodoApi();
        service = new TodoService(api);

        title = 'New Todo';
        description = 'This is a new todo';
    });

    describe('create()', async () => {
        it('creates todo', async () => {
            const todo = await service.create(title, description);

            expect(todo.id).toBe(1);
            expect(todo.title).toBe(title);
            expect(todo.description).toBe(description);
            expect(todo.status).toBe(TodoStatus.PENDING);
            expect(todo.createdAt).toBeInstanceOf(Date);
        });
    });

    describe('toggleStatus()', async () => {
        it('toggles todo status', async () => {
            const todo = await service.create(title, description);
            const toggledTodo = await service.toggleStatus(todo.id);

            expect(toggledTodo.status).toBe(TodoStatus.COMPLETED);
        });
    });

    describe('search()', async () => {
        it('searches todos', async () => {
            await service.create('First Todo', 'This is the first todo');
            await service.create('Second Todo', 'This is the second todo');

            const results = await service.search('first');

            expect(results).toHaveLength(1);
            expect(results[0]!.title).toBe('First Todo');
            expect(results[0]!.description).toBe('This is the first todo');
        });
    });
});
