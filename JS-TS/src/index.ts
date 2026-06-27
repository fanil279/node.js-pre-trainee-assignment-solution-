import { TodoNotFoundError } from './solutions/repository';
import { ToDoManager } from './solutions/todo-manager';

const manager = new ToDoManager();

async function main(): Promise<void> {
    const [, , command, ...args] = process.argv;

    await manager.init();

    switch (command) {
        case 'add':
            if (!args[0]) {
                console.log('Add <title> [description]');
                return;
            }

            await manager.add(args[0], args[1]);
            console.log('Todo added');
            break;

        case 'complete':
            const id = Number(args[0]);

            if (!Number.isInteger(id)) {
                console.log('Complete <id>');
                return;
            }

            await manager.complete(Number(args[0]));
            console.log('Todo completed');
            break;

        case 'list':
            console.table(await manager.list());
            break;

        default:
            console.log(`
                Usage:
                add <title> [description]
                complete <id>
                list
            `);
    }
}

main().catch((error) => {
    if (error instanceof TodoNotFoundError) {
        console.error(error.message);
    } else {
        console.error('Unexpected error:', error);
    }
});
