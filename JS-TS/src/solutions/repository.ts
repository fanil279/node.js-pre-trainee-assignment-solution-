export class TodoNotFoundError extends Error {
    constructor(id: number) {
        super(`Todo with id ${id} not found`);
        this.name = 'TodoNotFoundError';
    }
}

export class InMemoryRepository<T extends { id: number }> {
    private items: T[] = [];
    private notFound = (id: number): void => {
        const item = this.items.find((item) => item.id === id);

        if (!item) {
            throw new TodoNotFoundError(id);
        }
    };

    add(entity: T): T {
        this.items = [...this.items, entity];
        return entity;
    }

    update(id: number, patch: Partial<T>): T {
        this.notFound(id);

        this.items = this.items.map((item) => {
            if (item.id === id) {
                return { ...item, ...patch };
            }

            return item;
        });

        return this.items.find((item) => item.id === id)!;
    }

    remove(id: number): void {
        this.notFound(id);
        this.items = this.items.filter((item) => item.id !== id);
    }

    findById(id: number): T | undefined {
        return this.items.find((item) => item.id === id);
    }

    findAll(): T[] {
        return [...this.items];
    }
}
