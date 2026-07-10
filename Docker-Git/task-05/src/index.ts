import express from 'express';

const app = express();

const PORT = 3000;

app.get('/', (_, res) => {
    res.send('Hello Docker Multi-stage!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
