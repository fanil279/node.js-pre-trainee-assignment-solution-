const http = require('http');
const url = require('url');

const TodoService = require('./todoService');

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON in request body'));
            }
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
}

function parsePathParams(pattern, path) {
    const params = {};

    const patternSegments = pattern.split('/');
    const pathSegments = path.split('/');

    if (patternSegments.length !== pathSegments.length) return params;

    for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];

        if (patternSegment.startsWith(':')) {
            params[patternSegment.slice(1)] = pathSegment;
        }
    }

    return params;
}

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    });

    res.end(JSON.stringify(data));
}

function validateTodo(todoData, isUpdate = false) {
    const errors = [];

    if (todoData === null || typeof todoData !== 'object' || Array.isArray(todoData)) {
        return {
            isValid: false,
            errors: ['Request body must be a JSON object'],
        };
    }

    if (!isUpdate || 'title' in todoData) {
        if (
            typeof todoData.title !== 'string' ||
            todoData.title.trim().length < 1 ||
            todoData.title.trim().length > 100
        ) {
            errors.push('Title is required and must be a string between 1 and 100 characters');
        }
    }

    if ('description' in todoData) {
        if (typeof todoData.description !== 'string' || todoData.description.length > 500) {
            errors.push('Description must be a string with a maximum of 500 characters');
        }
    }

    if ('completed' in todoData) {
        if (typeof todoData.completed !== 'boolean') {
            errors.push('Completed must be a boolean');
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
    };
}

class TodoServer {
    constructor(port = 3000) {
        this.port = port;
        this.todoService = new TodoService();

        this.todoService.initializeSampleData();
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));

        server.on('error', (err) => {
            console.error('Server error:', err);
        });

        server.listen(this.port, () => {
            console.log(`TodoServer is running on http://localhost:${this.port}`);
        });
    }

    async handleRequest(req, res) {
        try {
            const parsedUrl = url.parse(req.url, true);
            const { pathname, query } = parsedUrl;
            const method = req.method;

            if (method === 'OPTIONS') {
                this.handleCORS(req, res);
                return;
            } else if (method === 'GET' && pathname === '/todos') {
                await this.getAllTodos(req, res, query);
                return;
            } else if (method === 'GET' && pathname.startsWith('/todos/')) {
                const params = parsePathParams('/todos/:id', pathname);

                await this.getTodoById(req, res, params);
                return;
            } else if (method === 'POST' && pathname === '/todos') {
                await this.createTodo(req, res);
                return;
            } else if (method === 'PUT' && pathname.startsWith('/todos/')) {
                const params = parsePathParams('/todos/:id', pathname);

                await this.updateTodo(req, res, params);
                return;
            } else if (method === 'DELETE' && pathname.startsWith('/todos/')) {
                const params = parsePathParams('/todos/:id', pathname);

                await this.deleteTodo(req, res, params);
                return;
            } else {
                return sendResponse(res, 404, {
                    success: false,
                    error: 'Route not found',
                });
            }
        } catch (error) {
            console.error('Request handling error:', error);

            // Avoid sending a second response if one has already been sent
            if (!res.headersSent) {
                // Differentiate between invalid JSON and internal server error
                if (error.message === 'Invalid JSON in request body') {
                    sendResponse(res, 400, {
                        success: false,
                        error: error.message,
                    });
                } else {
                    sendResponse(res, 500, {
                        success: false,
                        error: 'Internal server error',
                    });
                }
            }
        }
    }

    async getAllTodos(req, res, query) {
        const todos = this.todoService.getAll();

        sendResponse(res, 200, {
            success: true,
            data: todos,
            count: todos.length,
        });
    }

    async getTodoById(req, res, params) {
        const { id } = params;

        const todo = this.todoService.getById(id);

        if (!todo) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Todo not found',
            });
        }

        sendResponse(res, 200, {
            success: true,
            data: todo,
        });
    }

    async createTodo(req, res) {
        const body = await parseBody(req);

        const { isValid, errors } = validateTodo(body);

        if (!isValid) {
            return sendResponse(res, 400, {
                success: false,
                errors: errors,
            });
        }

        const todo = this.todoService.create(body);

        sendResponse(res, 201, {
            success: true,
            data: todo,
        });
    }

    async updateTodo(req, res, params) {
        const { id } = params;

        const body = await parseBody(req);

        const { isValid, errors } = validateTodo(body, true);

        if (!isValid) {
            return sendResponse(res, 400, {
                success: false,
                errors: errors,
            });
        }

        const todo = this.todoService.update(id, body);

        if (!todo) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Todo does not exist',
            });
        }

        sendResponse(res, 200, {
            success: true,
            data: todo,
        });
    }

    async deleteTodo(req, res, params) {
        const { id } = params;

        const deleted = this.todoService.delete(id);

        if (!deleted) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Todo not found',
            });
        }

        sendResponse(res, 200, {
            success: true,
            message: 'Todo deleted successfully',
        });
    }

    handleCORS(req, res) {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });

        res.end();
    }
}

module.exports = TodoServer;
