require('dotenv').config();

const express = require('express');

const { timer, headerInjector } = require('./task-01');
const routerUsers = require('./task-02');
const routerTodos = require('./task-04');
const errorHandler = require('./task-03');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(timer);
app.use(headerInjector);

app.use('/users/:id', routerUsers);
app.use('/todos', routerTodos);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
