const { Router } = require('express');
const { logger } = require('./task-01');

const router = Router();

const path = '/users/:id';

const getUser = (req, res, next) => {
    const { id } = req.params;
    const { active } = req.query;

    try {
        const idNumber = Number(id);

        if (Number.isNaN(idNumber)) {
            throw new Error('Id must be a number');
        }

        if (active !== 'true' && active !== 'false') {
            throw new Error('Active must be "true" or "false"');
        }

        res.send(`User ${idNumber} is ${active === 'true' ? 'active' : 'not active'}`);
    } catch (error) {
        next(error);
    }
};

router.use(path, logger);
router.get(path, getUser);

module.exports = router;
