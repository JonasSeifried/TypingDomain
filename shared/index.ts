export type ClientData = {
  socketId: string;
  playerName: string;
  typedText: string;
};

export type SocketData = {
  playerName: string;
  typedText: string;
  joinedRoom: string | null;
};

export type ServerToCLientEvents = {
  clientConnectedToSameRoom: (clients: ClientData[]) => void;
  startRound: (text: string) => void;
};

export type ClientToServerEvents = {
  joinRoom: (
    roomId: string,
    playerName: string,
    callback: (err?: Error) => void
  ) => void;
  textFieldInput: (text: string) => void;
};
