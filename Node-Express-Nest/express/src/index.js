require('dotenv').config();

const express = require('express');
const router = require('./task-02');
const { timer, headerInjector } = require('./task-01');
const errorHandler = require('./task-03');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(timer);
app.use(headerInjector);

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
