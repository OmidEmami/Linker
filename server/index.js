import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";
import http from "http";
import multer from "multer";
import moment from 'jalali-moment';
import path from "path";
import fs from 'fs';
import axios from "axios";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(cors({credentials:true, origin:['http://localhost:3000']}));
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(PORT, ()=> console.log('Server running at port 3001'));







