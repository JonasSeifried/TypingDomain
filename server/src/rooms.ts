import { ClientData, GameState, RoomData } from "shared";

export class Rooms {
  private roomData: Map<string, RoomData> = new Map();
  private socketIdsToRooms: Map<string, string> = new Map();
  private watcherFunctions: Function[] = [];

  public joinRoom(roomId: string, socketId: string, username: string): void {
    const room = this.getRoom(roomId);
    if (this.getRoomGameState(roomId) == GameState.WAITING) {
      room.players.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
      });
    } else {
      room.spectators.set(socketId, {
        socketId,
        username,
        typedText: "",
        isReady: false,
      });
    }
    this.socketIdsToRooms.set(socketId, roomId);
    this.changed(roomId);
  }

  public leaveRoom(roomId: string, socketId: string): boolean {
    const room = this.getRoom(roomId);
    room.players.delete(socketId);
    room.spectators.delete(socketId);
    const deleted = this.socketIdsToRooms.delete(socketId);
    if (deleted) this.changed(roomId);
    return deleted;
  }

  public setClientReady(socketId: string, ready: boolean): void {
    const room = this.getRoomOfClient(socketId);
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    room.players.get(socketId).isReady = ready;
    this.changed(room.id);
  }

  public setTextOfPlayer(socketId: string, text: string): void {
    const room = this.getRoomOfClient(socketId);
    if (!room.players.has(socketId)) throw new Error("User is not a player");
    room.players.get(socketId).typedText = text;
    this.changed(room.id);
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

  public startRoom(roomId: string): void {
    if (!this.roomReady(roomId)) {
      throw new Error("Can't start Game, not all clients are ready");
    }
    this.getRoom(roomId).gameState = GameState.PLAYING;
    this.changed(roomId);
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
      gameState: GameState.WAITING,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    });
  }

  public getRoomText(roomId: string): string {
    return this.getRoom(roomId).text;
  }

  public onRoomChanged(watcherFunction: (roomID) => void): void {
    this.watcherFunctions.push(watcherFunction);
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

  private changed(roomId: string): void {
    this.watcherFunctions.forEach((watcherFunction) => {
      watcherFunction(roomId);
    });
  }
}
