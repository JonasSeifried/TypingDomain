import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  activeText: null,
  clients: {},
});

// "undefined" means the URL will be computed from the `window.location` object
// eslint-disable-next-line no-undef
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("runStart", (data) => {
  state.activeText = data;
});

socket.on("clientConnected", (clients) => {
  state.clients = clients;
});