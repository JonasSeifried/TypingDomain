import { ClientData, RoomData } from "shared";

export class Rooms {
  private roomData: Map<string, RoomData> = new Map();
  private socketIdsToRooms: Map<string, string> = new Map();
  private watcherFunctions: Function[] = [];

  public joinRoom(roomId: string, socketId: string, username: string): void {
    if (!this.roomData.has(roomId)) {
      throw new Error("Room does not exist");
    }
    this.roomData.get(roomId).clients.set(socketId, {
      socketId,
      username,
      typedText: "",
      isReady: false,
    });
    this.socketIdsToRooms.set(socketId, roomId);
    this.changed(roomId);
  }

  public leaveRoom(roomId: string, socketId: string): boolean {
    this.roomData.get(roomId).clients.delete(socketId);
    const deleted = this.socketIdsToRooms.delete(socketId);
    if (deleted) this.changed(roomId);
    return deleted;
  }

  public setClientReady(socketId: string, ready: boolean): void {
    const roomId = this.socketIdsToRooms.get(socketId);
    this.roomData.get(roomId).clients.get(socketId).isReady = ready;
    this.changed(roomId);
  }

  public setTypedTextOfClient(socketId: string, text: string): void {
    const roomId = this.socketIdsToRooms.get(socketId);
    this.roomData.get(roomId).clients.get(socketId).typedText = text;
    this.changed(roomId);
  }

  public getClientDataOfRoom(roomId: string): ClientData[] {
    if (!this.roomData.has(roomId)) {
      throw new Error("Room does not exist");
    }
    return Array.from(this.roomData.get(roomId).clients.values());
  }

  public getRoomIdFromSocketId(socketId: string): string | undefined {
    return this.socketIdsToRooms.get(socketId);
  }

  public allClientsOfRoomReady(roomId: string): boolean {
    const clients = this.roomData.get(roomId).clients;
    return !Array.from(clients).some(
      ([_, clientData]) => clientData.isReady === false
    );
  }

  public setRoomStarted(roomId: string, started: boolean): void {
    if (started && !this.allClientsOfRoomReady(roomId)) {
      throw new Error("Not all clients are ready");
    }
    const oldStarted = this.roomData.get(roomId).started;
    this.roomData.get(roomId).started = started;
    if (oldStarted !== started) this.changed(roomId);
  }

  public deleteRoom(roomId: string): boolean {
    const deleted = this.roomData.delete(roomId);
    return deleted;
  }
  public createRoom(roomId: string): void {
    this.roomData.set(roomId, {
      id: roomId,
      clients: new Map(),
      started: false,
    });
  }

  private changed(roomId: string): void {
    this.watcherFunctions.forEach((watcherFunction) => {
      watcherFunction(roomId);
    });
  }

  public onRoomChanged(watcherFunction: (roomID) => void): void {
    this.watcherFunctions.push(watcherFunction);
  }
}
