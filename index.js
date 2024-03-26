require("./config/db")();
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

const routes = require("./routes");
const { endPoint } = require("./utils/endPoint");
const { seedAdmin } = require('./seeders/adminSeeder');

// Create Admin By Seed
seedAdmin();

// use ejs middleware
app.set("view engine", "ejs");
app.set("views", path.join("views"));

// Serve the 'uploads' directory (on project directory, we can access images in folder "uploads")
app.use('/uploads', express.static('uploads'));

//middlewares
// express.json(): use to get json format data from req.body
app.use(express.json());
app.use(cors());

// use app
app.get("/", (req, res) => {
    res.send("Main Page Of Backend Application, APP is Running...");
});

// All Routes of Application
app.use("/api", routes);
app.route("*").get(endPoint).post(endPoint).put(endPoint).delete(endPoint);

// Start Server
const port = process.env.PORT;
app.listen(port, () => console.info(`App is Running at PORT: ${port}.`));