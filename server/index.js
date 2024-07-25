import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import http from "http";
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
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
app.use(cors(corsOptions));
const server = http.createServer(app);

// Apply middleware

app.use(cookieParser());
app.use(express.json({ limit: '500mb' })); // Adjust the limit as necessary
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

app.use(router);

// Initialize WebSocketServer and attach to the server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('User connected');

  // Send a ping to the client every 30 seconds
  const intervalId = setInterval(() => {
      ws.ping();
  }, 30000);

  ws.on('pong', () => {
      console.log('Pong received from client');
  });

  ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(intervalId); // Clear the interval on client disconnect
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
const DB_URL = "mongodb://127.0.0.1:27017/linkefileholder";
async function main(){
  await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("connected to mongodb");
    const db = mongoose.connection;
  
    

}
server.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`));

// Exposing transmitData for external use
export const transmitData = async (params) => {
  
  setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify({ type: 'ping' }));
      }
    });
  }, 30000);
  const dataString = JSON.stringify(params); // Convert params to a string

  await wss.clients.forEach((client) => {
    
      client.send(dataString); // Send the stringified data
    
  });
};
main();