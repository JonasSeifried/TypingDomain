import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ClientData, ServerToCLientEvents, SocketData } from "shared";

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToCLientEvents, {}, SocketData>(server);

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.data = { playerName: null, typedText: "", joinedRoom: null };
    socket.emit('startRound', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
    socket.on('textFieldInput', (text) => {
      socket.data.typedText = text;
      notifyClients(socket);
    });

    socket.on('joinRoom', (roomName: string, playerName: string, callback) => {
      if (roomName.trim().length === 0) return callback("Room name is required");
      socket.rooms.forEach((room) => { socket.leave(room); });
      socket.data.playerName = playerName.trim() === "" ? socket.id : playerName.trim();
      socket.join(roomName);
      socket.data.joinedRoom = roomName;
      notifyClients(socket);
      callback(undefined);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
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

function notifyClients(socket: Socket) {
  const room = socket.data.joinedRoom;
  const socketsConnectedToRoom = io.sockets.adapter.rooms.get(room);
  const clients: SocketData[] = Array.from(socketsConnectedToRoom).map((id) => io.sockets.sockets.get(id).data);
  const clientData: ClientData[] = clients.map((client) => ({ playerName: client.playerName, typedText: client.typedText }));
  io.to(room).emit('clientConnectedToSameRoom', clientData);
}