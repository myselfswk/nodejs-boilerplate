import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import http from 'http';
import cluster from "cluster";
import os from "os";
import { fileURLToPath } from 'url'; // Import this for __dirname workaround 

import { conpressResponse } from "./helpers/compressResponse.js";
import { secureHeader } from "./helpers/secureHeader.js";
import { ipLimiter } from "./helpers/ipLimiter.js";
import database from './config/db.js';
import { seedAdmin } from './seeders/admin.seeder.js';
import { endPoint } from './utils/endPoint.js';
import routes from "./routes/index.js";
dotenv.config();
database();
seedAdmin();

let numCPUs = os.cpus().length;
var PORT = process.env.PORT || 8000;

// Data handling range (req.body from user) default is 100kb
const app = express();
app.use(express.json({ limit: '100mb' })); // Handle large JSON data
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // Handle large form data
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
app.use(secureHeader);
app.use(conpressResponse);
app.use(ipLimiter);

app.use("/api", routes);

app.get("/", (req, res) => res.send("Welcome to the Users API!"));
app.route("*").get(endPoint).post(endPoint).put(endPoint).delete(endPoint);

if (cluster.isPrimary) {
    console.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    let server = http.createServer(corsOptions, app).listen(PORT, () => {
        console.info(`App is Running at PORT: ${PORT}, Worker ${process.pid} started`);
    });

    // Graceful Shutdown
    process.on("SIGINT", () => {
        console.info("Server shutting down...");
        server.close(() => {
            console.info("Server closed");
            process.exit(0);
        });
    });

    process.on("SIGTERM", () => {
        console.info("Server received SIGTERM");
        server.close(() => {
            console.info("Server closed");
            process.exit(0);
        });
    });

}
// app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));