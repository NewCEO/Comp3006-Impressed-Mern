import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
import { initializeSocket } from './routes/socket'; 

 const app = express();
app.use(express.static("assets"));

const server = http.createServer(app);
// const io = new Server(server);
initializeSocket(server); 

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://EternalManager:W5bAY6opsix5zcaK@cluster0.kstp5zh.mongodb.net/ImpressionsAbound");

app.use("/user", userRouter);
app.use("/products", productRouter);

server.listen(3001, () => console.log("Server Started"));

export default app