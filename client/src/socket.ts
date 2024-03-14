import { reactive } from "vue";
import { io, Socket } from "socket.io-client";
import type { Clients, ClientToServerEvents, ServerToCLientEvents } from "shared"

type State = {
  connected: boolean;
  activeText: string | null;
  clients: Clients;
};

export const state = reactive<State>({
  connected: false,
  activeText: null,
  clients: {},
});

// "undefined" means the URL will be computed from the `window.location` object
// eslint-disable-next-line no-undef
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

socket.on("clientConnected", (clients) => {
  state.clients = clients;
});