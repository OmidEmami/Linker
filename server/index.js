import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import http from "http";
import { Server } from "socket.io";

// Initialize dotenv to use environment variables
dotenv.config();

// Retrieve environment variables
const { PORT = 3001, FRONTEND_URL = "https://gmhotel.ir" } = process.env;

// Configure CORS options based on environment variables
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

const app = express();
const server = http.createServer(app);

// Apply middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Initialize Socket.IO with CORS and attach to the server
const io = new Server(server, { cors: { ...corsOptions, methods: ["GET", "POST"] } });

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    console.log(`Socket ${socket.id} joined room ${room}`);
    socket.join(room);
  });

  socket.on("send_message", (message) => {
    console.log(`Message sent in room ${message.room}: ${message.content}`);
    io.to(message.room).emit("receive_message", message);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`));

// Exposing transmitData for external use
export const transmitData = (params) => {
  io.emit("receive_message", params);
};
