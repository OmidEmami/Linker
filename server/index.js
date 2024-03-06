import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import http from "http";
import { WebSocketServer } from 'ws';

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

// Initialize WebSocketServer and attach to the server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('User connected');

  // Listen for messages from the client
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    // Check if the received message is a "ping"
    if (message.type === "ping") {
      console.log("Ping received");
      // Respond with a "pong" message
      ws.send(JSON.stringify({ type: "pong" }));
    }

    // Here you can add additional handling for other types of messages
  });

  // Handle WebSocket close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`));

// Exposing transmitData for external use
export const transmitData = async (params) => {
  console.log(params);

  const dataString = JSON.stringify(params); // Convert params to a string

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataString); // Send the stringified data
    }
  });
};
