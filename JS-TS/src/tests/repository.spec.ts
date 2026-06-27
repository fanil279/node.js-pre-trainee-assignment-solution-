import { InMemoryRepository, TodoNotFoundError } from '../solutions/repository';
import { type Todo, TodoStatus } from '../solutions/types';

describe('InMemoryRepository', () => {
    let repository: InMemoryRepository<Todo>;

    let todo: Todo;
    let todo2: Todo;

    beforeEach(() => {
        repository = new InMemoryRepository<Todo>();

        todo = {
            id: 1,
            title: 'Todo',
            description: '',
            status: TodoStatus.PENDING,
            createdAt: new Date(),
        };

        todo2 = {
            id: 2,
            title: 'Todo 2',
            description: '',
            status: TodoStatus.PENDING,
            createdAt: new Date(),
        };
    });

    describe('add()', () => {
        it('adds todo', () => {
            repository.add(todo);

            expect(repository.findAll()).toHaveLength(1);
            expect(repository.findById(1)).toEqual(todo);
        });
    });

    describe('update()', () => {
        it('updates todo', () => {
            repository.add(todo);

            const updatedTodo = repository.update(1, {
                title: 'Updated Todo',
            });

            expect(updatedTodo.title).toBe('Updated Todo');
            expect(repository.findById(1)?.title).toBe('Updated Todo');
        });

        it('throws when updating non-existing todo', () => {
            expect(() => repository.update(100, { title: 'Test' })).toThrow(TodoNotFoundError);
        });
    });

    describe('remove()', () => {
        it('removes todo', () => {
            repository.add(todo);
            repository.remove(1);

            expect(repository.findAll()).toHaveLength(0);
            expect(repository.findById(1)).toBeUndefined();
        });

        it('throws when removing non-existing todo', () => {
            expect(() => repository.remove(100)).toThrow(TodoNotFoundError);
        });
    });

    describe('findById()', () => {
        it('finds todo by id', () => {
            repository.add(todo);

            expect(repository.findById(1)).toEqual(todo);
        });
    });

    describe('findAll()', () => {
        it('finds all todos', () => {
            repository.add(todo);
            repository.add(todo2);

            expect(repository.findAll()).toHaveLength(2);
        });
    });
});
