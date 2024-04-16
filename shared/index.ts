import { WebResult } from "./result";

export type ClientData = {
  socketId: string;
  username: string;
  typedText: string;
  isReady: boolean;
  isFinished: boolean;
  finishedAt: number;
};

export type SocketData = {};

export type RoomData = {
  id: string;
  players: Map<string, ClientData>;
  spectators: Map<string, ClientData>;
  gameState: GameState;
  text: string;
  playTime: number;
};

export type ClientRoomData = {
  state: GameState;
  text: string;
  playTime: number;
};

export enum GameState {
  PREGAME,
  INGAME,
  POSTGAME,
}

export type ServerToCLientEvents = {
  clientDataInRoomChanged: (clients: WebResult<ClientData[]>) => void;
  roomDataChanged: (clientRoomData: WebResult<ClientRoomData>) => void;
  roomStartRoundCountDown: (countdown: number) => void;
  playerFinished: () => void;
};

export type ClientToServerEvents = {
  joinRoom: (
    roomId: string,
    username: string,
    callback: (joinedAsSpectator: WebResult<boolean>) => void
  ) => void;
  textFieldInput: (text: string) => void;
  roomSetReady: (ready: boolean) => void;
  leaveRoom: () => void;
};
