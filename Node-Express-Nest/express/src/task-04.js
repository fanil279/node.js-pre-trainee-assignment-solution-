const { Router } = require('express');

const { logger } = require('./task-01');
const TodoService = require('../../node/src/solutions/todoService');

const routerTodos = Router();

const todoService = new TodoService();

function validateTodo(req, res, next) {
    if (!req.body || !req.body.title) {
        const error = new Error('Title is required');
        error.status = 400;

        return next(error);
    }

    next();
}

routerTodos.use(logger);

routerTodos.get('/', (req, res, next) => {
    try {
        const todos = todoService.getAll(req.query);

        res.status(200).json({
            success: true,
            data: todos,
        });
    } catch (error) {
        error.status ??= 400;
        next(error);
    }
});

routerTodos.get('/:id', (req, res, next) => {
    try {
        const todo = todoService.getById(req.params.id);

        if (!todo) {
            const error = new Error('Todo not found');
            error.status = 404;

            throw error;
        }

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        next(error);
    }
});

routerTodos.post('/', validateTodo, (req, res, next) => {
    try {
        const todo = todoService.create(req.body);

        res.status(201).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        next(error);
    }
});

routerTodos.put('/:id', validateTodo, (req, res, next) => {
    try {
        const todo = todoService.update(req.params.id, req.body);

        if (!todo) {
            const error = new Error('Todo not found');
            error.status = 404;

            throw error;
        }

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        next(error);
    }
});

routerTodos.delete('/:id', (req, res, next) => {
    try {
        const deleted = todoService.delete(req.params.id);

        if (!deleted) {
            const error = new Error('Todo not found');
            error.status = 404;

            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = routerTodos;
