import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/User';
import { TodoEntity } from './entities/Todo';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,

    entities: [UserEntity, TodoEntity],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
