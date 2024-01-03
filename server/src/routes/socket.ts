import { Server, Socket } from "socket.io";

let ioSocket: Socket;

export const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {
    ioSocket = socket
    console.log("A user connected")

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export const getSocket = () => {
  if (!ioSocket) {
    throw new Error("Socket.io has not been initialized");
  }else{
    console.log("socket.io initialized")
  }

  return ioSocket;
};
