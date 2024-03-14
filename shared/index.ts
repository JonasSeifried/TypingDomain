export type Clients = {
    [id: string]: {
      typedText: string;
    };
  }

export type ServerToCLientEvents = {
  clientConnected: (clients: Clients) => void;
  startRound: (text: string) => void;
}

export type ClientToServerEvents = {
  joinRoom: (roomId: string, callback: (err: string) => void) => void;
  textFieldInput: (text: string) => void;
}