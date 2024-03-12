import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

var clients = {};

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    clients[socket.id] = {};
    clients[socket.id].typedText = "";
    socket.emit('foo', 'Hello from server');

    socket.on('input', (typedText, callback) => {
      console.log('Received:', typedText);
      clients[socket.id].typedText = typedText;
        callback(clients[socket.id].typedText);
    });
  });



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});