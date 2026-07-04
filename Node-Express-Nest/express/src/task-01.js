const logger = (req, _res, next) => {
    console.log({
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
    });

    next();
};

const timer = (_req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        console.log(`Request took ${Date.now() - start} ms`);
    });

    next();
};

const headerInjector = (_req, res, next) => {
    res.set({
        'X-App-Name': 'Express Playground',
        'X-API-Version': '1.0',
    });

    next();
};

module.exports = {
    logger,
    timer,
    headerInjector,
};
