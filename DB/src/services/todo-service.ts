import { redis } from '../clients/redis';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/User';
import { TodoEntity } from '../entities/Todo';
import { CreateTodo, UpdateTodo } from '../types';

export class TodoService {
    constructor(
        private readonly todoRepository: Repository<TodoEntity>,
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async create(data: CreateTodo): Promise<void> {
        try {
            const user = await this.userRepository.findOneBy({
                id: data.userId,
            });

            if (!user) {
                throw new Error('User not found');
            }

            const todo = this.todoRepository.create({
                title: data.title,
                description: data.description,
                status: data.status,
                user: user,
            });

            await this.todoRepository.save(todo);

            await redis.del('todos');
            await redis.del(`todos:user:${user.id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findAll(): Promise<TodoEntity[]> {
        try {
            const key = 'todos';

            const cached = await redis.get(key);

            if (cached) {
                console.log('Cache hit');
                return JSON.parse(cached);
            }

            console.log('Cache miss');

            const todos = await this.todoRepository.find();

            await redis.set(key, JSON.stringify(todos), 'EX', 300);

            return todos;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findAllByUserId(id: number): Promise<TodoEntity[]> {
        const key = `todos:user:${id}`;

        const cached = await redis.get(key);

        if (cached) {
            console.log('Cache hit');
            return JSON.parse(cached);
        }

        console.log('Cache miss');

        const todos = await this.todoRepository.find({
            where: {
                user: {
                    id: id,
                },
            },
        });

        await redis.set(key, JSON.stringify(todos), 'EX', 5); // for demonstration purposes 5s otherwise would be 5m

        return todos;
    }

    async update(id: number, data: UpdateTodo) {
        try {
            const todo = await this.todoRepository.findOneBy({ id });

            if (!todo) {
                throw new Error('Todo not found');
            }

            this.todoRepository.merge(todo, data);

            await this.todoRepository.save(todo);

            await redis.del('todos');
            await redis.del(`todos:user:${todo.user.id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            const todo = await this.todoRepository.findOneBy({ id });

            if (!todo) {
                throw new Error('Todo not found');
            }

            await this.todoRepository.remove(todo);

            await redis.del('todos');
            await redis.del(`todos:user:${todo.user.id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
