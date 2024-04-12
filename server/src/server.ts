import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  err,
  GameState,
  ok,
  ServerToCLientEvents,
  SocketData,
} from "shared";
import { Rooms } from "./rooms";
import { on } from "node:events";

const app = express();
const server = createServer(app);

export const io = new Server<
  ClientToServerEvents,
  ServerToCLientEvents,
  {},
  SocketData
>(server, { cors: { origin: "*" } });

const rooms = new Rooms();

rooms.onCliendDataChanged(onClientDataChanged);
rooms.onRoomDataChanged(onRoomDataChanged);

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("textFieldInput", (text) => {
    onTypedTextChanged(socket, text);
  });

  socket.on("joinRoom", (roomId: string, username: string, callback) => {
    console.log(roomId, username);
    const trimmedUsername = username?.trim();
    const trimmedRoomId = roomId?.trim();
    if (!trimmedRoomId || trimmedRoomId.length === 0)
      return callback(err(Error("Room name is required")));
    if (!trimmedUsername || trimmedUsername.length === 0)
      return callback(err(Error("Username is required")));

    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(trimmedRoomId);
    rooms.joinRoom(trimmedRoomId, socket.id, trimmedUsername);
    callback(ok(rooms.getRoomGameState(trimmedRoomId) !== GameState.PREGAME));
  });

  socket.on("roomSetReady", (isReady: boolean) => {
    rooms.setClientReady(socket.id, isReady);
    const roomId = rooms.getRoomIdFromSocketId(socket.id);
    if (rooms.roomReady(roomId)) {
      startRoomCountDown(roomId);
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

function onTypedTextChanged(socket: Socket, text: string) {
  const roomId = rooms.getRoomIdFromSocketId(socket.id);
  const cappedText = text.substring(0, rooms.getRoomText(roomId).length);
  rooms.setTextOfPlayer(socket.id, cappedText);
  if (cappedText.length == rooms.getRoomText(roomId).length) {
    rooms.setPlayerFinished(socket.id);
    socket.emit("playerFinished");
    if (rooms.allPlayersFinished(roomId)) {
      rooms.endGame(roomId);
    }
  }
}

function onClientDataChanged(roomId: string) {
  io.to(roomId).emit(
    "clientDataInRoomChanged",
    rooms.getClientDataOfRoom(roomId)
  );
}

function onRoomDataChanged(roomId: string) {
  io.to(roomId).emit("roomDataChanged", {
    state: rooms.getRoomGameState(roomId),
    text: rooms.getRoomText(roomId),
  });
}

function startRoomGameTimer(roomId: string) {
  let timer = 0;
  const interval = setInterval(() => {
    if (!rooms.hasRoom(roomId)) {
      clearInterval(interval);
      return;
    }
    io.to(roomId).emit("roomGameTimer", timer++);
    if (rooms.getRoomGameState(roomId) === GameState.POSTGAME) {
      clearInterval(interval);
      return;
    }
  }, 1000);
}

function startRoomCountDown(roomId: string) {
  let countdown = 300;
  const interval = setInterval(() => {
    if (!rooms.hasRoom(roomId)) {
      clearInterval(interval);
      return;
    }
    io.to(roomId).emit("roomStartRoundCountDown", countdown / 100);
    if (countdown === 0) {
      clearInterval(interval);
      rooms.setRoomText(
        roomId,
        "This is a short text example to test the game"
        //"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      );
      rooms.startGame(roomId);
      startRoomGameTimer(roomId);
      return;
    }
    countdown--;
  }, 1);
}
