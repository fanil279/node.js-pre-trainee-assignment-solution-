const { Router } = require('express');

const { logger } = require('./task-01');

const routerUsers = Router();

const getUser = (req, res, next) => {
    const { id } = req.params;
    const { active } = req.query;

    const idNumber = Number(id);

    if (Number.isNaN(idNumber)) {
        const error = new Error('Id must be a number');
        error.status = 400;

        return next(error);
    }

    if (active !== 'true' && active !== 'false') {
        const error = new Error('Active must be "true" or "false"');
        error.status = 400;

        return next(error);
    }

    res.send(`User ${idNumber} is ${active === 'true' ? 'active' : 'not active'}`);
};

routerUsers.use('/', logger);

routerUsers.get('/', getUser);

module.exports = routerUsers;
