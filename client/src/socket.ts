import { reactive } from "vue";
import { io, Socket } from "socket.io-client";
import type { ClientData, ClientToServerEvents, ServerToCLientEvents } from "shared"

type State = {
  connected: boolean;
  activeText: string | null;
  joinedRoom: string | null;
  clientsInRoom: ClientData[];
};

export const state = reactive<State>({
  connected: false,
  activeText: null,
  joinedRoom: null,
  clientsInRoom: [],
});

// "undefined" means the URL will be computed from the `window.location` object

const URL: string | undefined = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket: Socket<ServerToCLientEvents, ClientToServerEvents> = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("startRound", (text) => {
  state.activeText = text;
});

socket.on("clientConnectedToSameRoom", (clients) => {
  state.clientsInRoom = clients;
});