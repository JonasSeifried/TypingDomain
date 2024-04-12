export type Result<T, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };

export function ok<T>(result: T): Result<T>;
export function ok(): Result<void>;
export function ok<T>(result?: T): Result<T> | Result<void> {
  if (result === undefined) return { success: true, result: undefined };
  return { success: true, result: result };
}

export function err<E extends Error = Error>(error: E): Result<any, E> {
  return { success: false, error };
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`
  );
  return error;
}

export type ClientData = {
  socketId: string;
  username: string;
  typedText: string;
  isReady: boolean;
  isFinished: boolean;
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
  PREGAME,
  INGAME,
  POSTGAME,
}

export type ServerToCLientEvents = {
  clientDataInRoomChanged: (clients: ClientData[]) => void;
  roomDataChanged: (clientRoomData: { state: GameState; text: string }) => void;
  roomStartRoundCountDown: (countdown: number) => void;
  roomGameTimer: (timer: number) => void;
  playerFinished: () => void;
};

export type ClientToServerEvents = {
  joinRoom: (
    roomId: string,
    username: string,
    callback: (joinedAsSpectator: Result<boolean>) => void
  ) => void;
  textFieldInput: (text: string) => void;
  roomSetReady: (ready: boolean) => void;
};
