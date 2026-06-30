const { EventEmitter } = require('events');
const { randomUUID } = require('crypto');

class MyEmitter extends EventEmitter {
    constructor() {
        super();

        this.messages = [];
        this.users = new Set();
    }

    sendMessage(type, content, sender) {
        const allowedTypes = ['message', 'notification', 'alert'];

        if (!allowedTypes.includes(type)) {
            throw new Error('Message type is not supported');
        }

        const message = {
            id: randomUUID(),
            type: type,
            content: content,
            timestamp: new Date(),
            sender: sender,
        };

        this.emit('message', message);
        this.emit(type, message);

        if (this.messages.length === 10) {
            this.messages.shift();
        }

        this.messages.push(message);
    }

    subscribeToMessages(callback) {
        this.on('message', callback);
    }

    subscribeToType(type, callback) {
        this.on(type, callback);
    }

    getMessageHistory() {
        return [...this.messages];
    }

    clearHistory() {
        this.messages.length = 0;
    }

    getStats() {
        return {
            messageCount: this.messages.length,
            userCount: this.getUserCount(),
        };
    }

    addUser(username) {
        this.users.add(username);
        this.emit('user-joined', username);
    }

    removeUser(username) {
        this.users.delete(username);
        this.emit('user-left', username);
    }

    getUserCount() {
        return this.users.size;
    }

    getActiveUsers() {
        return [...this.users];
    }
}

const emitter = new MyEmitter();

emitter.subscribeToMessages((msg) => {
    console.log('ALL:', msg);
});

emitter.subscribeToType('alert', (msg) => {
    console.log('ALERT:', msg);
});

emitter.addUser('Fanil');
emitter.sendMessage('alert', 'Server is down!', 'Admin');

module.exports = MyEmitter;
