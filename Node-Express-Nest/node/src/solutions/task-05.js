const http = require('http');
const url = require('url');
const { EventEmitter } = require('events');

function sendJson(res, status, body) {
    const data = JSON.stringify(body);

    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });

    res.end(data);
}

function parseIdFromPath(pathname) {
    const m = pathname.match(/^\/todos\/(\d+)$/);
    return m ? Number(m[1]) : null;
}

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => (data += chunk));

        req.on('end', () => {
            if (!data) return resolve({});

            try {
                const json = JSON.parse(data);
                resolve(json);
            } catch (e) {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', reject);
    });
}

function nowISO() {
    return new Date().toISOString();
}

class AnalyticsTracker {
    constructor() {
        this.stats = {
            totalCreated: 0,
            totalUpdated: 0,
            totalDeleted: 0,
            totalViews: 0,
            errors: 0,
            dailyStats: {},
        };
    }

    _bumpDaily(field) {
        const today = new Date().toISOString().split('T')[0];

        if (!this.stats.dailyStats[today]) {
            this.stats.dailyStats[today] = {
                created: 0,
                updated: 0,
                deleted: 0,
                views: 0,
            };
        }

        this.stats.dailyStats[today][field]++;
    }

    trackCreated() {
        this.stats.totalCreated++;
        this._bumpDaily('created');
    }

    trackUpdated() {
        this.stats.totalUpdated++;
        this._bumpDaily('updated');
    }

    trackDeleted() {
        this.stats.totalDeleted++;
        this._bumpDaily('deleted');
    }

    trackViewed() {
        this.stats.totalViews++;
        this._bumpDaily('views');
    }

    trackError() {
        this.stats.errors++;
    }

    getStats() {
        return this.stats;
    }
}

class ConsoleLogger {
    todoCreated(data) {
        console.log(`📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`);
    }

    todoUpdated(data) {
        console.log(
            `✏️  [${data.timestamp}] Updated ID ${
                data.newTodo.id
            }; changed: ${data.changes.join(', ')}`,
        );
    }

    todoDeleted(data) {
        console.log(`🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`);
    }

    todoViewed(data) {
        console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
    }

    todosListed(data) {
        console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
    }

    todoNotFound(data) {
        console.warn(`⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`);
    }

    validationError(data) {
        console.error(`❌ [${data.timestamp}] Validation error: ${data.errors.join(', ')}`);
    }

    serverError(data) {
        console.error(
            `💥 [${data.timestamp}] Server error in ${data.operation}: ${
                data.error && data.error.message
            }`,
        );
    }
}

function validateTodoPayload(payload, isCreate = false) {
    const errors = [];
    const out = {};

    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
        return {
            values: {},
            errors: ['Request body must be a JSON object'],
        };
    }

    if (isCreate || 'title' in payload) {
        if (typeof payload.title !== 'string' || payload.title.trim().length < 1) {
            errors.push('Title must be a non-empty string');
        }
    }

    if (payload.description !== undefined) {
        if (typeof payload.description !== 'string') {
            errors.push('Description must be a string');
        }
    }

    if (payload.completed !== undefined) {
        if (typeof payload.completed !== 'boolean') {
            errors.push('Completed must be a boolean');
        }
    }

    if ('title' in payload) out.title = payload.title;
    if ('description' in payload) out.description = payload.description;
    if ('completed' in payload) out.completed = payload.completed;
    else if (isCreate) out.completed = false;

    return {
        errors: errors,
        values: out,
    };
}

class TodoServer extends EventEmitter {
    constructor(port = 3000) {
        super();

        this.port = port;
        this.todos = [];
        this.nextId = 1;

        this.analytics = new AnalyticsTracker();
        this.logger = new ConsoleLogger();
        this.recentEvents = [];

        this.server = null;

        this._wireDefaultListeners();
    }

    _wireDefaultListeners() {
        const remember = (eventType) => (data) => {
            this.recentEvents.push({ eventType, timestamp: nowISO(), data });
            if (this.recentEvents.length > 100) this.recentEvents.shift();
        };

        [
            'todoCreated',
            'todoUpdated',
            'todoDeleted',
            'todoViewed',
            'todosListed',
            'todoNotFound',
            'validationError',
            'serverError',
        ].forEach((evt) => this.on(evt, remember(evt)));

        this.on('todoCreated', (d) => this.logger.todoCreated(d));
        this.on('todoUpdated', (d) => this.logger.todoUpdated(d));
        this.on('todoDeleted', (d) => this.logger.todoDeleted(d));
        this.on('todoViewed', (d) => this.logger.todoViewed(d));
        this.on('todosListed', (d) => this.logger.todosListed(d));
        this.on('todoNotFound', (d) => this.logger.todoNotFound(d));
        this.on('validationError', (d) => this.logger.validationError(d));
        this.on('serverError', (d) => this.logger.serverError(d));

        this.on('todoCreated', () => this.analytics.trackCreated());
        this.on('todoUpdated', () => this.analytics.trackUpdated());
        this.on('todoDeleted', () => this.analytics.trackDeleted());
        this.on('todoViewed', () => this.analytics.trackViewed());
        this.on('validationError', () => this.analytics.trackError());
        this.on('serverError', () => this.analytics.trackError());
    }

    async start() {
        this.server = http.createServer((req, res) => this._handleRequest(req, res));

        this.server.on('error', (error) => {
            console.error('Server error:', error);
        });

        this.server.listen(this.port, () => {
            console.log(`TodoServer is running on port ${this.port}`);
        });
    }

    async stop() {
        if (!this.server) return;
        this.server.close();
    }

    async _handleRequest(req, res) {
        try {
            const { pathname, query } = url.parse(req.url, true);
            const method = req.method;

            if (method === 'OPTIONS') {
                res.writeHead(204, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                });

                res.end();
            }

            if (method === 'GET' && pathname === '/todos') {
                let todos = this.todos;

                if (query.completed !== undefined) {
                    const completedFilter = query.completed.toLowerCase();

                    if (completedFilter === 'true') {
                        todos = todos.filter((todo) => todo.completed);
                    } else if (completedFilter === 'false') {
                        todos = todos.filter((todo) => !todo.completed);
                    } else {
                        sendJson(res, 400, {
                            success: false,
                            error: 'Invalid completed query parameter. Use true or false.',
                        });

                        return;
                    }
                }

                this.emit('todosListed', {
                    todos: todos,
                    count: todos.length,
                    filters: query,
                    timestamp: nowISO(),
                    requestInfo: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.headers['user-agent'],
                        ip: req.socket.remoteAddress,
                    },
                });

                sendJson(res, 200, {
                    success: true,
                    data: todos,
                    count: todos.length,
                });
            }

            if (method === 'GET' && parseIdFromPath(pathname) !== null) {
                const id = parseIdFromPath(pathname);

                const todo = this.todos.find((todo) => todo.id === id) || null;

                if (!todo) {
                    this.emit('todoNotFound', {
                        todoId: id,
                        operation: 'GET',
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 404, {
                        success: false,
                        error: 'Todo not found',
                    });

                    return;
                }

                this.emit('todoViewed', {
                    todo: todo,
                    timestamp: nowISO(),
                    requestInfo: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.headers['user-agent'],
                        ip: req.socket.remoteAddress,
                    },
                });

                sendJson(res, 200, {
                    success: true,
                    data: todo,
                });
            }

            if (method === 'POST' && pathname === '/todos') {
                const body = await parseBody(req);

                const { errors, values } = validateTodoPayload(body, true);

                if (errors.length > 0) {
                    this.emit('validationError', {
                        errors: errors,
                        data: body,
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 400, {
                        success: false,
                        errors: errors,
                    });

                    return;
                }

                const todo = {
                    id: this.nextId++,
                    title: values.title,
                    description: values.description,
                    completed: values.completed ?? false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                this.todos.push(todo);

                this.emit('todoCreated', {
                    todo: todo,
                    timestamp: nowISO(),
                    requestInfo: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.headers['user-agent'],
                        ip: req.socket.remoteAddress,
                    },
                });

                sendJson(res, 201, {
                    success: true,
                    data: todo,
                });
            }

            if (method === 'PUT' && parseIdFromPath(pathname) !== null) {
                const id = parseIdFromPath(pathname);

                const todo = this.todos.find((todo) => todo.id === id) || null;

                if (!todo) {
                    this.emit('todoNotFound', {
                        todoId: id,
                        operation: 'PUT',
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 404, {
                        success: false,
                        error: 'Todo does not exist',
                    });

                    return;
                }

                const body = await parseBody(req);
                const { values, errors } = validateTodoPayload(body, false);

                if (errors.length > 0) {
                    this.emit('validationError', {
                        errors: errors,
                        data: body,
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 400, {
                        success: false,
                        errors: errors,
                    });

                    return;
                }

                const oldTodo = { ...todo };
                const changes = [];

                if ('title' in values) {
                    todo.title = values.title;
                    changes.push('title');
                }

                if ('description' in values) {
                    todo.description = values.description;
                    changes.push('description');
                }

                if ('completed' in values) {
                    todo.completed = values.completed;
                    changes.push('completed');
                }

                todo.updatedAt = nowISO();

                this.emit('todoUpdated', {
                    oldTodo: oldTodo,
                    newTodo: todo,
                    changes: changes,
                    timestamp: nowISO(),
                    requestInfo: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.headers['user-agent'],
                        ip: req.socket.remoteAddress,
                    },
                });

                sendJson(res, 200, {
                    success: true,
                    data: todo,
                });

                return;
            }

            if (method === 'DELETE' && parseIdFromPath(pathname) !== null) {
                const id = parseIdFromPath(pathname);

                const todoIndex = this.todos.findIndex((todo) => todo.id === id);

                if (todoIndex === -1) {
                    this.emit('todoNotFound', {
                        todoId: id,
                        operation: 'DELETE',
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 404, {
                        success: false,
                        error: 'Todo index is not found',
                    });

                    return;
                }

                const [todo] = this.todos.splice(todoIndex, 1);

                this.emit('todoDeleted', {
                    todo: todo,
                    timestamp: nowISO(),
                    requestInfo: {
                        method: req.method,
                        url: req.url,
                        userAgent: req.headers['user-agent'],
                        ip: req.socket.remoteAddress,
                    },
                });

                sendJson(res, 200, {
                    success: true,
                    message: 'Todo deleted successfuly',
                });
            }

            if (method === 'GET' && pathname === '/analytics') {
                sendJson(res, 200, {
                    success: true,
                    data: this.analytics.getStats(),
                });

                return;
            }

            if (method === 'GET' && pathname === '/events') {
                const last = Number(query.last) || 10;

                const events = this.recentEvents.slice(-last);

                sendJson(res, 200, {
                    success: true,
                    data: events,
                });

                return;
            }

            sendJson(res, 404, {
                success: false,
                error: 'Route not found',
            });
        } catch (error) {
            if (!res.headersSent) {
                if (error.message === 'Invalid JSON') {
                    this.emit('validationError', {
                        errors: [error.message],
                        data: null,
                        timestamp: nowISO(),
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 400, {
                        success: false,
                        errors: [error.message],
                    });

                    return;
                } else {
                    this.emit('serverError', {
                        error: error,
                        operation: `${req.method} ${req.url}`,
                        requestInfo: {
                            method: req.method,
                            url: req.url,
                            userAgent: req.headers['user-agent'],
                            ip: req.socket.remoteAddress,
                        },
                    });

                    sendJson(res, 500, {
                        success: false,
                        error: 'Internal server error',
                    });
                }
            }
        }
    }
}

module.exports = { TodoServer };
