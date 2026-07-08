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
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findAll(): Promise<TodoEntity[]> {
        try {
            const todos = await this.todoRepository.find();

            return todos;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async update(id: number, data: UpdateTodo) {
        try {
            const todo = await this.todoRepository.findOneBy({ id });

            if (!todo) {
                throw new Error('Todo not found');
            }

            this.todoRepository.merge(todo, data);

            await this.todoRepository.save(todo);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            const deletedTodo = await this.todoRepository.delete(id);

            if (deletedTodo.affected === 0) {
                throw new Error(`Todo with id: ${id} does not exist`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
