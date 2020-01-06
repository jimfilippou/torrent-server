// Library imports
const express = require("express");
const Database = require("./utils/db");

// Initiate DB
// const t = new Database().getInstance();

// Route imports
const torrentController = require("./routes/torrent");
const videoController = require("./routes/torrent");


// Initiate express instance
const app = express();
const port = 3000;

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('pug', require('pug').__express);
app.set('views', __dirname+'\\views');
app.set('view engine', 'pug');
// Add custom controllers to handlers
app.use('/torrent', torrentController);

app.use('/torrent', videoController);
// Tests if the server is running
app.get("/ping", function (req, res) {
    res.send("pong");
});

// Get all torrents
app.get("/torrents", function (req, res) {
    const torrents = db.get("torrents").value();
    res.json(torrents);
});

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}!`));
