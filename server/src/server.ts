import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import {
  ClientRoomData,
  ClientToServerEvents,
  GameState,
  ServerToCLientEvents,
  SocketData,
} from "shared";
import { err, fromResult, ok, Result, webErr, webOk } from "shared/result";
import { Rooms } from "./rooms";

const app = express();
const server = createServer(app);

export const io = new Server<
  ClientToServerEvents,
  ServerToCLientEvents,
  {},
  SocketData
>(server, { cors: { origin: "*" }, path: "/api/socket" });

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
      return callback(webErr(Error("Room name is required")));
    if (!trimmedUsername || trimmedUsername.length === 0)
      return callback(webErr(Error("Username is required")));

    leaveAllRooms(socket);
    socket.join(trimmedRoomId);
    rooms.joinRoom(trimmedRoomId, socket.id, trimmedUsername);
    const result = rooms.getRoomGameState(trimmedRoomId);
    if (result.isErr()) {
      callback(fromResult(result));
      return;
    }
    callback(webOk(result.value !== GameState.PREGAME));
  });

  socket.on("roomSetReady", (isReady: boolean) => {
    rooms.setClientReady(socket.id, isReady);
    const result = rooms.getRoomIdFromSocketId(socket.id);
    if (result.isErr()) {
      console.warn(result.error);
      return;
    }
    const roomId = result.value;
    if (rooms.roomReady(roomId)) {
      startRoomCountDown(roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("leaveRoom", () => leaveAllRooms(socket));
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
  const result = rooms.getRoomIdFromSocketId(socket.id);
  if (result.isErr()) {
    // Todo: handle error
    console.warn(result.error);
    return;
  }
  const roomId = result.value;
  const resultRoomText = rooms.getRoomText(roomId);
  if (resultRoomText.isErr()) {
    // Todo: handle error
    console.warn(resultRoomText.error);
    return;
  }
  const roomText = resultRoomText.value;
  const cappedText = text.substring(0, roomText.length);
  rooms.setTextOfPlayer(socket.id, cappedText);
  if (cappedText.length == roomText.length) {
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
    fromResult(rooms.getClientDataOfRoom(roomId))
  );
}

function onRoomDataChanged(roomId: string) {
  io.to(roomId).emit(
    "roomDataChanged",
    fromResult(buildClientRoomData(roomId))
  );
}

function buildClientRoomData(roomId: string): Result<ClientRoomData> {
  const resultGameState = rooms.getRoomGameState(roomId);
  if (resultGameState.isErr()) return err(resultGameState.error);
  const resultText = rooms.getRoomText(roomId);
  if (resultText.isErr()) return err(resultText.error);
  const resultPlayTime = rooms.getRoomPlayTime(roomId);
  if (resultPlayTime.isErr()) return err(resultPlayTime.error);
  return ok({
    state: resultGameState.value,
    text: resultText.value,
    playTime: resultPlayTime.value,
  });
}

function startRoomPlayTimer(roomId: string) {
  const start = Date.now();
  const roomPlayTimerInterval = setInterval(() => {
    const result = rooms.getRoomGameState(roomId);
    if (
      !rooms.hasRoom(roomId) ||
      result.isErr() ||
      result.value === GameState.POSTGAME
    ) {
      clearInterval(roomPlayTimerInterval);
      return;
    }
    rooms.setRoomPlayTime(roomId, Date.now() - start);
  }, 100);

  const updateUiInterval = setInterval(() => {
    const result = rooms.getRoomGameState(roomId);
    if (
      !rooms.hasRoom(roomId) ||
      result.isErr() ||
      result.value === GameState.POSTGAME
    )
      clearInterval(updateUiInterval);
    onRoomDataChanged(roomId);
  }, 100);
}

function startRoomCountDown(roomId: string) {
  const end = Date.now() + 3000;
  const interval = setInterval(() => {
    if (!rooms.hasRoom(roomId)) {
      clearInterval(interval);
      return;
    }
    const delta = end - Date.now();
    io.to(roomId).emit("roomStartRoundCountDown", delta / 1000);
    if (delta <= 0) {
      clearInterval(interval);
      rooms.setRoomText(
        roomId,
        "This is a short text example to test the game"
        //"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      );
      rooms.startGame(roomId);
      startRoomPlayTimer(roomId);
      return;
    }
  }, 10);
}

function leaveAllRooms(socket: Socket) {
  socket.rooms.forEach((room) => {
    socket.leave(room);
  });
}
