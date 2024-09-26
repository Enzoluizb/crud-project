const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];
const secret = 'mysecretkey';

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const user = { name, email, password };
    users.push(user);
    res.status(201).json({ message: 'User registered' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.email}` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
