export type ClientData = {
  socketId: string;
  username: string;
  typedText: string;
  isReady: boolean;
};

export type SocketData = {
  username: string;
  typedText: string;
  joinedRoom: string | null;
  isReady: boolean;
};

export type ServerToCLientEvents = {
  clientDataInRoomChanged: (clients: ClientData[]) => void;
  startRound: (text: string) => void;
};

export type ClientToServerEvents = {
  joinRoom: (
    roomId: string,
    username: string,
    callback: (err?: Error) => void
  ) => void;
  textFieldInput: (text: string) => void;
  roomSetReady: (ready: boolean) => void;
};
