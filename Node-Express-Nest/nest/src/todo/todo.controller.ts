import { Controller, ParseIntPipe, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoDto } from './dto/todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    findAll(): Promise<TodoDto[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
        return this.todoService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateTodoDto): Promise<TodoDto> {
        return this.todoService.create(dto);
    }

    @Put(':id')
    update(@Body() dto: UpdateTodoDto, id: number): Promise<TodoDto> {
        return this.todoService.update(dto, id);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): void {
        this.todoService.delete(id);
    }
}
