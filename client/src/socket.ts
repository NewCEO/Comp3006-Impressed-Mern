// client/src/socket.ts
import socketIOClient from "socket.io-client";

export const socket = socketIOClient("http://localhost:3001", {
    transports: ["websocket", "polling"]}); 

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
