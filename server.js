// server.js
const express = require('express');
const http = require('http'); 
const { Server } = require("socket.io");
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*" } 
});

const PORT = process.env.PORT || 3001;
const APP_NAME = process.env.APP_NAME;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors()); 
app.use(express.json());

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    birth_year: Joi.number().integer().min(1900).max(new Date().getFullYear())
});

app.post('/api/users', (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid data', details: error.details });
    }
    console.log('Validated data:', value);
    res.status(201).json({ message: 'User created successfully!', data: value });
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'This data is open for everyone!' });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', `[${socket.id} says]: ${msg}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// This is the only server.listen() you need
server.listen(PORT, () => {
    console.log(`🚀 ${APP_NAME || 'Server'} is running on http://localhost:${PORT}`);
});