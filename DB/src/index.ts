import 'dotenv/config';
import { AppDataSource } from './data-source';
import { redis } from './clients/redis';
import { TodoService } from './services/todo-service';
import { UserEntity } from './entities/User';
import { TodoEntity } from './entities/Todo';

async function test() {
    try {
        await AppDataSource.initialize();

        const todoRepository = AppDataSource.getRepository(TodoEntity);
        const userRepository = AppDataSource.getRepository(UserEntity);

        const todoService = new TodoService(todoRepository, userRepository);

        // clear previous cache
        await redis.del('todos:user:1');

        const todos = await todoService.findAllByUserId(1); // Cache miss
        console.log(todos);

        const cachedTodos = await todoService.findAllByUserId(1); // Cache hit
        console.log(cachedTodos);

        await new Promise((resolve) => setTimeout(resolve, 6000));

        await todoService.findAllByUserId(1); // Cache miss (expired)
    } catch (error) {
        await redis.quit();
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

void test();
