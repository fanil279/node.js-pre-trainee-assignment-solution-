class TodoService {
    constructor() {
        this.todos = [];
        this.nextId = 1;

        this.initializeSampleData();
    }

    initializeSampleData() {
        this.todos = [
            {
                id: this.generateNextId(),
                title: 'Sample Todo 1',
                description: 'This is a sample todo item.',
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: this.generateNextId(),
                title: 'Sample Todo 2',
                description: 'This is another sample todo item.',
                completed: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: this.generateNextId(),
                title: 'Sample Todo 3',
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
    }

    getAll(query = {}) {
        let todos = this.todos;

        if (query.completed !== undefined) {
            const completed = query.completed.toLowerCase();

            if (completed === 'true') {
                todos = todos.filter((todo) => todo.completed);
            } else if (completed === 'false') {
                todos = todos.filter((todo) => !todo.completed);
            } else {
                throw new Error('Invalid completed query parameter. Use true or false.');
            }
        }

        return todos;
    }

    getById(id) {
        return this.findTodoById(id);
    }

    create(data) {
        const todo = {
            id: this.generateNextId(),
            title: data.title,
            description: data.description,
            completed: data.completed ?? false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.todos.push(todo);

        return todo;
    }

    update(id, data) {
        const todo = this.findTodoById(id);

        if (!todo) {
            return null;
        }

        if ('title' in data) {
            todo.title = data.title;
        }

        if ('description' in data) {
            todo.description = data.description;
        }

        if ('completed' in data) {
            todo.completed = data.completed;
        }

        todo.updatedAt = new Date().toISOString();

        return todo;
    }

    delete(id) {
        const index = this.findTodoIndexById(id);

        if (index === -1) {
            return false;
        }

        this.todos.splice(index, 1);

        return true;
    }

    findTodoById(id) {
        const numId = Number(id);

        if (!Number.isInteger(numId)) {
            return null;
        }

        return this.todos.find((todo) => todo.id === numId) || null;
    }

    findTodoIndexById(id) {
        const numId = Number(id);

        if (!Number.isInteger(numId)) {
            return -1;
        }

        return this.todos.findIndex((todo) => todo.id === numId);
    }

    generateNextId() {
        if (!Number.isSafeInteger(this.nextId)) {
            throw new Error('Next ID exceeds safe integer limit');
        }

        return this.nextId++;
    }
}

module.exports = TodoService;
