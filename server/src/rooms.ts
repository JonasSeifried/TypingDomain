import { ClientData, GameState, RoomData } from "shared";

export class Rooms {
  private roomData: Map<string, RoomData> = new Map();
  private socketIdsToRooms: Map<string, string> = new Map();
  private onClientDataChangedEventHandlers: Function[] = [];
  private onRoomDataChangedEventHandlers: Function[] = [];

  public joinRoom(roomId: string, socketId: string, username: string): void {
    const room = this.getRoom(roomId);
    if (this.getRoomGameState(roomId) == GameState.PREGAME) {
      room.players.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
        isFinished: false,
      });
    } else {
      room.spectators.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
        isFinished: false,
      });
    }
    this.socketIdsToRooms.set(socketId, roomId);
    this.emitClientDataChangedEvent(roomId);
    this.emitRoomDataChangedEvent(roomId);
  }

  public leaveRoom(roomId: string, socketId: string): boolean {
    const room = this.getRoom(roomId);
    room.players.delete(socketId);
    room.spectators.delete(socketId);
    const deleted = this.socketIdsToRooms.delete(socketId);
    if (deleted) this.emitClientDataChangedEvent(roomId);
    return deleted;
  }

  public setClientReady(socketId: string, ready: boolean): void {
    const room = this.getRoomOfClient(socketId);
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    room.players.get(socketId).isReady = ready;
    this.emitClientDataChangedEvent(room.id);
  }

  public setTextOfPlayer(socketId: string, text: string): void {
    const room = this.getRoomOfClient(socketId);
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    if (room.players.get(socketId).isFinished)
      throw new Error("User is already finished");
    room.players.get(socketId).typedText = text;
    this.emitClientDataChangedEvent(room.id);
  }

  public setPlayerFinished(socketId: string): void {
    const room = this.getRoomOfClient(socketId);
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    room.players.get(socketId).isFinished = true;
    this.emitClientDataChangedEvent(room.id);
  }

  public allPlayersFinished(roomId: string): boolean {
    const room = this.getRoom(roomId);
    return !Array.from(room.players).some(([_, player]) => !player.isFinished);
  }

  public getClientDataOfRoom(roomId: string): ClientData[] {
    return Array.from(this.getRoom(roomId).players.values());
  }

  public getRoomIdFromSocketId(socketId: string): string {
    return this.getRoomOfClient(socketId).id;
  }

  public getRoomGameState(roomId: string): GameState {
    return this.getRoom(roomId).gameState;
  }

  public startGame(roomId: string): void {
    if (!this.roomReady(roomId)) {
      throw new Error("Can't start Game, not all clients are ready");
    }
    this.getRoom(roomId).gameState = GameState.INGAME;
    this.emitRoomDataChangedEvent(roomId);
  }

  public endGame(roomId: string): void {
    this.getRoom(roomId).gameState = GameState.POSTGAME;
    this.emitRoomDataChangedEvent(roomId);
  }

  public roomReady(roomId: string): boolean {
    const clients = this.getRoom(roomId).players;
    return !Array.from(clients).some(
      ([_, clientData]) => clientData.isReady === false
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
    });
  }

  public getRoomText(roomId: string): string {
    return this.getRoom(roomId).text;
  }

  public setRoomText(roomId: string, text: string): void {
    this.getRoom(roomId).text = text;
    this.emitRoomDataChangedEvent(roomId);
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

  private getRoomOfClient(socketId: string): RoomData {
    const roomId = this.socketIdsToRooms.get(socketId);
    if (!roomId) {
      throw new Error(`Client "${socketId}" is not in a room`);
    }
    return this.getRoom(roomId);
  }

  private getRoom(roomId: string): RoomData {
    const room = this.roomData.get(roomId);
    if (!room) {
      throw new Error("Room does not exist");
    }
    return room;
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
