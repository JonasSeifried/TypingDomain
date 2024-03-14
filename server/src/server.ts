import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ClientToServerEvents, Clients, ServerToCLientEvents } from "shared";

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToCLientEvents>(server);

var clients: Clients = {};

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    clients[socket.id] = { typedText: "" };
    updateClients();
    socket.emit('startRound', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");

    socket.on('textFieldInput', (text) => {
      clients[socket.id].typedText = text;
      updateClients();
    });

    socket.on('joinRoom', (roomName: string, setError) => {
      if (roomName.trim().length === 0) return setError("Room name is required");
      socket.rooms.forEach((room) => { socket.leave(room); });
      socket.join(roomName);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
      delete clients[socket.id];
    });
  });

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`User ${id} has joined room ${room}`);
});

io.of("/").adapter.on("leave-room", (room, id) => {
  console.log(`User ${id} has left room ${room}`);
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

function updateClients() {
  io.emit('clientConnected', clients);
}