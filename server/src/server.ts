import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ClientData,
  ServerToCLientEvents,
  SocketData,
} from "shared";

const app = express();
const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToCLientEvents,
  {},
  SocketData
>(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.data = {
    username: null,
    typedText: "",
    joinedRoom: null,
    isReady: false,
  };
  socket.on("textFieldInput", (text) => {
    socket.data.typedText = text;
    notifyClients(socket);
  });

  socket.on("joinRoom", (roomName: string, username: string, callback) => {
    if (roomName.trim().length === 0)
      return callback(Error("Room name is required"));
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
    socket.data.username = username.trim();
    socket.join(roomName);
    socket.data.joinedRoom = roomName;
    notifyClients(socket);
    callback();
  });

  socket.on("roomSetReady", (isReady: boolean) => {
    socket.data.isReady = isReady;
    notifyClients(socket);
    if (allClientsOfRoomReady(socket.data.joinedRoom)) {
      io.to(socket.data.joinedRoom).emit(
        "startRound",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      );
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  const connectedCount = io.sockets.adapter.rooms.get(room)?.size;
  console.log(
    `User ${id} has joined room ${room} (${connectedCount} connected)`
  );
});

io.of("/").adapter.on("leave-room", (room, id) => {
  notifyClients(io.sockets.sockets.get(id));
  console.info(`User ${id} has left room ${room}`);
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

function notifyClients(
  socket: Socket<ClientToServerEvents, ServerToCLientEvents, {}, SocketData>
) {
  const room = socket.data.joinedRoom;
  const socketsConnectedToRoom = io.sockets.adapter.rooms.get(room);
  if (!socketsConnectedToRoom) return;
  const clientData: ClientData[] = Array.from(socketsConnectedToRoom).map(
    (id) => clientDataFromSocketId(id)
  );
  io.to(room).emit("clientDataInRoomChanged", clientData);
}

function allClientsOfRoomReady(room: string) {
  var allClientsOfRoomReady = true;
  socketIdsOfClientsInRoom(room).forEach((socketId) => {
    if (clientDataFromSocketId(socketId).isReady === false) {
      allClientsOfRoomReady = false;
      return;
    }
  });
  return allClientsOfRoomReady;
}

function socketIdsOfClientsInRoom(room: string) {
  return io.sockets.adapter.rooms.get(room);
}

function clientDataFromSocketId(socketId: string) {
  const socket = io.sockets.sockets.get(socketId);
  return {
    socketId,
    username: socket.data.username,
    typedText: socket.data.typedText,
    isReady: socket.data.isReady,
  };
}
