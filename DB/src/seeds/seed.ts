import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/User';
import { Status } from '../entities/Todo';

const seedData = [
    {
        name: 'Alice',
        email: 'alice@example.com',
        todos: [
            {
                title: 'Buy milk',
                description: '2 liters',
                status: Status.ACTIVE,
            },
            {
                title: 'Go to the gym',
                description: 'Leg day',
                status: Status.COMPLETED,
            },
            {
                title: 'Read a book',
                description: '30 pages',
                status: Status.ACTIVE,
            },
        ],
    },
    {
        name: 'Bob',
        email: 'bob@example.com',
        todos: [
            {
                title: 'Study TypeORM',
                description: 'Relations',
                status: Status.ACTIVE,
            },
            {
                title: 'Walk the dog',
                description: '',
                status: Status.ACTIVE,
            },
            {
                title: 'Clean the room',
                description: '',
                status: Status.COMPLETED,
            },
        ],
    },
];

async function seed(): Promise<void> {
    try {
        await AppDataSource.initialize();

        const userRepository = AppDataSource.getRepository(UserEntity);

        for (const userData of seedData) {
            const user = userRepository.create({
                name: userData.name,
                email: userData.email,
                todos: userData.todos,
            });

            await userRepository.save(user);
        }

        console.info('Database seeded successfully');
    } catch (error) {
        console.error(error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

void seed();
