const metrics = {
    totalRequests: 0,
    totalResponseTime: 0,
    avgResponseTime: 0,
};

const metricsLogger = (req, res, next) => {
    if (req.originalUrl === '/todos/metrics') {
        return next();
    }

    const start = Date.now();

    console.log({
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
    });

    metrics.totalRequests++;

    res.on('finish', () => {
        const time = Date.now() - start;

        metrics.totalResponseTime += time;
        metrics.avgResponseTime = metrics.totalResponseTime / metrics.totalRequests;
    });

    next();
};

module.exports = {
    metrics,
    metricsLogger,
};
