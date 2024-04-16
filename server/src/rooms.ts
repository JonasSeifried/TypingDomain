import { ClientData, GameState, RoomData } from "shared";
import { err, ok, Result } from "shared/result";

export class Rooms {
  private roomData: Map<string, RoomData> = new Map();
  private socketIdsToRooms: Map<string, string> = new Map();
  private onClientDataChangedEventHandlers: Function[] = [];
  private onRoomDataChangedEventHandlers: Function[] = [];

  public joinRoom(
    roomId: string,
    socketId: string,
    username: string
  ): Result<void> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    const room = result.value;
    const resultGameState = this.getRoomGameState(roomId);
    if (resultGameState.isErr()) return resultGameState;
    if (resultGameState.value == GameState.PREGAME) {
      room.players.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
        isFinished: false,
        finishedAt: -1,
      });
    } else {
      room.spectators.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
        isFinished: false,
        finishedAt: -1,
      });
    }
    this.socketIdsToRooms.set(socketId, roomId);
    this.emitClientDataChangedEvent(roomId);
    this.emitRoomDataChangedEvent(roomId);
  }

  public leaveRoom(roomId: string, socketId: string): Result<boolean> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    const room = result.value;
    room.players.delete(socketId);
    room.spectators.delete(socketId);
    const deleted = this.socketIdsToRooms.delete(socketId);
    if (deleted) this.emitClientDataChangedEvent(roomId);
    return ok(deleted);
  }

  public setClientReady(socketId: string, ready: boolean): Result<void> {
    const result = this.getRoomOfClient(socketId);
    if (result.isErr()) return result;
    const room = result.value;
    if (!room.players.has(socketId)) return err(Error("User is not a player"));
    room.players.get(socketId).isReady = ready;
    this.emitClientDataChangedEvent(room.id);
  }

  public setTextOfPlayer(socketId: string, text: string): Result<void> {
    const result = this.getRoomOfClient(socketId);
    if (result.isErr()) return result;
    const room = result.value;
    if (!room.players.has(socketId)) return err(Error("User is not a player"));
    if (room.players.get(socketId).isFinished)
      return err(Error("User is already finished"));
    room.players.get(socketId).typedText = text;
    this.emitClientDataChangedEvent(room.id);
  }

  public setPlayerFinished(socketId: string): Result<void> {
    const result = this.getRoomOfClient(socketId);
    if (result.isErr()) return result;
    const room = result.value;
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    room.players.get(socketId).isFinished = true;
    const resultRoomTime = this.getRoomPlayTime(room.id);
    if (resultRoomTime.isErr()) return resultRoomTime;
    room.players.get(socketId).finishedAt = resultRoomTime.value;
    this.emitClientDataChangedEvent(room.id);
  }

  public allPlayersFinished(roomId: string): Result<boolean> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    return ok(
      !Array.from(result.value.players).some(
        ([_, player]) => !player.isFinished
      )
    );
  }

  public getClientDataOfRoom(roomId: string): Result<ClientData[]> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    return ok(Array.from(result.value.players.values()));
  }

  public getRoomIdFromSocketId(socketId: string): Result<string> {
    const result = this.getRoomOfClient(socketId);
    if (result.isErr()) return result;
    return ok(result.value.id);
  }

  public getRoomGameState(roomId: string): Result<GameState> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    return ok(result.value.gameState);
  }

  public startGame(roomId: string): Result<void> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    if (!this.roomReady(roomId)) {
      return err(Error("Can't start Game, not all clients are ready"));
    }
    result.value.gameState = GameState.INGAME;
    this.emitRoomDataChangedEvent(roomId);
  }

  public endGame(roomId: string): Result<void> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    result.value.gameState = GameState.POSTGAME;
    this.emitRoomDataChangedEvent(roomId);
  }

  public roomReady(roomId: string): Result<boolean> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    return ok(
      !Array.from(result.value.players).some(
        ([_, clientData]) => clientData.isReady === false
      )
    );
  }

  public deleteRoom(roomId: string): boolean {
    const deleted = this.roomData.delete(roomId);
    return deleted;
  }

  public createRoom(roomId: string): void {
    this.roomData.set(roomId, {
      id: roomId,
      players: new Map(),
      spectators: new Map(),
      gameState: GameState.PREGAME,
      text: "This room hasnt begun yet",
      playTime: 0,
    });
  }

  public getRoomText(roomId: string): Result<string> {
    const result = this.getRoom(roomId);
    return result.isErr() ? result : ok(result.value.text);
  }

  public setRoomText(roomId: string, text: string): Result<void> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    result.value.text = text;
    this.emitRoomDataChangedEvent(roomId);
  }

  public setRoomPlayTime(roomId: string, time: number): Result<void> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    result.value.playTime = time;
    // ? This should probably emitRoomDataChangedEvent but that would result in alot of socket events
  }

  public getRoomPlayTime(roomId: string): Result<number> {
    const result = this.getRoom(roomId);
    if (result.isErr()) return result;
    return ok(result.value.playTime);
  }

  public onCliendDataChanged(func: (roomID) => void): void {
    this.onClientDataChangedEventHandlers.push(func);
  }

  public onRoomDataChanged(func: (roomID) => void): void {
    this.onRoomDataChangedEventHandlers.push(func);
  }

  public hasRoom(roomId: string): boolean {
    return this.roomData.has(roomId);
  }

  private getRoomOfClient(socketId: string): Result<RoomData> {
    const roomId = this.socketIdsToRooms.get(socketId);
    return !roomId
      ? err(Error(`Client "${socketId}" is not in a room`))
      : this.getRoom(roomId);
  }

  private getRoom(roomId: string): Result<RoomData> {
    const room = this.roomData.get(roomId);
    return !room ? err(Error("Room does not exist")) : ok(room);
  }

  private emitClientDataChangedEvent(roomId: string): void {
    this.onClientDataChangedEventHandlers.forEach((func) => {
      func(roomId);
    });
  }
  private emitRoomDataChangedEvent(roomId: string): void {
    this.onRoomDataChangedEventHandlers.forEach((func) => {
      func(roomId);
    });
  }
}
