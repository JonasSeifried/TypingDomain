export type SocketId = string
export type ClientData = {
    playerName: string | null;
    typedText: string;
}


export type SocketData = {
  playerName: string | null;
  typedText: string;
  joinedRoom: string | null;
}

export type ServerToCLientEvents = {
  clientConnectedToSameRoom: (clients: ClientData[]) => void;
  startRound: (text: string) => void;
}

export type ClientToServerEvents = {
  joinRoom: (roomId: string, playerName: string, callback: (err: string | undefined) => void) => void;
  textFieldInput: (text: string) => void;
}