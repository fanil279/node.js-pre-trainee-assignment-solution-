const express = require('express');

const app = express();

const PORT = 3000;

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Node API',
    });
});

app.get('/data', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Apple',
        },
        {
            id: 2,
            name: 'Banana',
        },
        {
            id: 3,
            name: 'Orange',
        },
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
