const DatabaseService = require('./utils/db');
const express = require("express");
const cors = require('cors')

// Routes
const torrentController = require("./routes/torrent");
const videoController = require("./routes/video");

// Start the DB
const Instance = new DatabaseService().getInstance();
Instance.start();

// Initiate express instance
const app = express();
const port = 3000;

// Use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add custom controllers to handlers
app.use('/torrent', torrentController);
app.use('/video', videoController);

// Tests if the server is running
app.get("/ping", function (req, res) {
    res.send("pong");
});

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}!`));
