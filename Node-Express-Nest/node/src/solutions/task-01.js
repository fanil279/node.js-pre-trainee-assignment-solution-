const { EventEmitter } = require('events');

class MyEmitter extends EventEmitter {
    constructor() {
        super();

        this.messages = [];
        this.users = new Set();
        this.messageId = 1;
    }

    sendMessage(type, content, sender = 'System') {
        const allowedTypes = ['message', 'notification', 'alert'];

        if (!allowedTypes.includes(type)) {
            throw new Error('Message type is not supported');
        }

        const message = {
            id: this.messageId++,
            type: type,
            content: content,
            timestamp: new Date(),
            sender: sender,
        };

        this.messages.push(message);

        this.emit('message', message);
        this.emit(type, message);

        if (this.messages.length > 100) {
            this.messages.shift();
        }

        return message;
    }

    subscribeToMessages(callback) {
        this.on('message', callback);
    }

    subscribeToType(type, callback) {
        this.on(type, callback);
    }

    getMessageHistory(count = 10) {
        return this.messages.slice(-count);
    }

    clearHistory() {
        this.messages.length = 0;
    }

    getStats() {
        return {
            totalMessages: this.messages.length,
            activeUsers: this.getUserCount(),
            messagesByType: this.messages.reduce((acc, msg) => {
                acc[msg.type] = (acc[msg.type] || 0) + 1;
                return acc;
            }, {}),
        };
    }

    addUser(username) {
        this.users.add(username);

        this.emit('user-joined', {
            id: this.messageId++,
            type: 'user-joined',
            content: `${username} joined the system`,
            timestamp: new Date(),
        });
    }

    removeUser(username) {
        this.users.delete(username);

        this.emit('user-left', {
            id: this.messageId++,
            type: 'user-left',
            content: `${username} left the system`,
            timestamp: new Date(),
        });
    }

    getUserCount() {
        return this.users.size;
    }

    getActiveUsers() {
        return [...this.users];
    }
}

module.exports = MyEmitter;
