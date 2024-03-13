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
    updateClients();
    socket.emit('runStart', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");

    socket.on('input', (typedText) => {
      clients[socket.id].typedText = typedText;
      updateClients();
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
      delete clients[socket.id];
    });
  });


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});


function updateClients() {
  io.emit('clientConnected', clients);
}