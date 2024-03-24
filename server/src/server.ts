import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToCLientEvents, SocketData } from "shared";
import { Rooms } from "./rooms";

const app = express();
const server = createServer(app);

export const io = new Server<
  ClientToServerEvents,
  ServerToCLientEvents,
  {},
  SocketData
>(server, { cors: { origin: "*" } });

const rooms = new Rooms();

rooms.onRoomChanged(notifyClients);

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("textFieldInput", (text) => rooms.setTextOfPlayer(socket.id, text));

  socket.on("joinRoom", (roomId: string, username: string, callback) => {
    if (roomId.trim().length === 0)
      return callback(Error("Room name is required"));
    if (username.trim().length === 0)
      return callback(Error("Username is required"));

    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(roomId);
    rooms.joinRoom(roomId, socket.id, username.trim());
    callback(undefined, rooms.getRoomGameState(roomId));
  });

  socket.on("roomSetReady", (isReady: boolean) => {
    rooms.setClientReady(socket.id, isReady);
    const roomId = rooms.getRoomIdFromSocketId(socket.id);
    if (rooms.roomReady(roomId)) {
      rooms.startRoom(roomId);
      io.to(roomId).emit("startRound", rooms.getRoomText(roomId));
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

io.of("/").adapter.on("create-room", (roomId) => {
  rooms.createRoom(roomId);
  console.log(`Room "${roomId}" created`);
});

io.of("/").adapter.on("delete-room", (roomId) => {
  rooms.deleteRoom(roomId);
  console.log(`Room "${roomId}" deleted`);
});

io.of("/").adapter.on("join-room", (roomId, socketId) => {
  console.log(`User "${socketId}" joined room "${roomId}"`);
});

io.of("/").adapter.on("leave-room", (roomId, socketId) => {
  rooms.leaveRoom(roomId, socketId);
  console.log(`User "${socketId}" left room "${roomId}"`);
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

function notifyClients(roomId: string) {
  io.to(roomId).emit(
    "clientDataInRoomChanged",
    rooms.getClientDataOfRoom(roomId)
  );
}
