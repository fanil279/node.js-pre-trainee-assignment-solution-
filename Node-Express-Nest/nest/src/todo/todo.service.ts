import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(
        // Finds and injects the TypeORM database repository, into
        // repository param, specifically generated for the TodoEntity
        @InjectRepository(TodoEntity)
        private readonly repository: Repository<TodoEntity>,
    ) {}

    private static toDto(entity: TodoEntity): TodoDto {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            completed: entity.completed,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private async findEntityById(id: number): Promise<TodoEntity> {
        const entity = await this.repository.findOneBy({ id });

        if (!entity) {
            throw new NotFoundException(`Todo with id ${id} not found`);
        }

        return entity;
    }

    async findAll(): Promise<TodoDto[]> {
        const entities = await this.repository.find();

        return entities.map((entity) => TodoService.toDto(entity));
    }

    async findById(id: number): Promise<TodoDto> {
        const entity = await this.findEntityById(id);

        return TodoService.toDto(entity);
    }

    async create(dto: CreateTodoDto): Promise<TodoDto> {
        const entity = this.repository.create(dto);
        const saved = await this.repository.save(entity);

        return TodoService.toDto(saved);
    }

    async update(dto: UpdateTodoDto, id: number): Promise<TodoDto> {
        const entity = await this.findEntityById(id);

        this.repository.merge(entity, dto);

        const saved = await this.repository.save(entity);

        return TodoService.toDto(saved);
    }

    async delete(id: number): Promise<void> {
        const result = await this.repository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
    }
}
