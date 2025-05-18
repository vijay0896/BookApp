// src/socket.js
import { io } from "socket.io-client";
import { BASE_URLS } from "./config";

const socket = io(BASE_URLS, {
  transports: ["websocket"], // Optional but good for mobile
});

export default socket;
