export type ClientData = {
  socketId: string;
  username: string;
  typedText: string;
  isReady: boolean;
};

export type SocketData = {};

export type RoomData = {
  id: string;
  players: Map<string, ClientData>;
  spectators: Map<string, ClientData>;
  gameState: GameState;
  text: string;
};

export enum GameState {
  WAITING,
  PLAYING,
  FINISHED,
}

export type ServerToCLientEvents = {
  clientDataInRoomChanged: (clients: ClientData[]) => void;
  startRound: (text: string) => void;
  roomDataChanged: (gameState: GameState, text: string) => void;
};

export type ClientToServerEvents = {
  joinRoom: (
    roomId: string,
    username: string,
    callback: (error?: Error, joinedAsSpectator?: boolean) => void
  ) => void;
  textFieldInput: (text: string) => void;
  roomSetReady: (ready: boolean) => void;
};
