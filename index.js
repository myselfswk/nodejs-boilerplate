import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url'; // Import this for __dirname workaround

import database from './config/db.js';
import { seedAdmin } from './seeders/admin.seeder.js';

import { endPoint } from './utils/endPoint.js';
import routes from "./routes/index.js";
dotenv.config();
database();
seedAdmin();

var PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

// use ejs middleware
app.set("view engine", "ejs");

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));

// Serve the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cors Options
const corsOptions = { credentials: true }
app.options('*', cors(corsOptions)); // Pre-flight support
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // or restrict to specific origin like 'http://localhost:5173'
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api", routes);

app.get("/", (req, res) => res.send("Welcome to the Users API!"));
app.route("*").get(endPoint).post(endPoint).put(endPoint).delete(endPoint);

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));