import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

// Initialize dotenv to use environment variables
dotenv.config();

// Configure CORS options
const corsOptions = {
  origin: "https://gmhotel.ir", // Ensure this matches your frontend URL exactly, including protocol (http/https)
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true, // This is important for sessions or when using cookies/token authentication
};

const app = express();
const server = http.createServer(app);

// Apply middleware
app.use(cors(corsOptions)); // Use CORS with the specified options
app.use(cookieParser()); // Parse Cookie header and populate req.cookies
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads
app.use(router); // Use your routes

// Create a new instance of socket.io and configure CORS for it
const io = new Server(server, {
  cors: {
    origin: "https://gmhotel.ir", // Ensure this matches your frontend URL and is consistent with the Express CORS configuration
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  },
});

// Socket.io connection setup
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`));

// Function to transmit data using socket.io
function transmitData(params) {
  io.local.emit("receive_message", params);
}

export default transmitData;
