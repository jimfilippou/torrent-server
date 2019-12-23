const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ torrents: [], user: {} }).write();

const app = express();
const port = 3000;

app.get("/ping", function (req, res) {
    res.send("pong");
});

// Function for downloading torrent with magnet URL
app.post("/magnet", function (req, res) {
    const torrentMagnet = "example";
    db.get("torrents")
        .push({ id: 1, title: "lowdb is awesome" })
        .write();
});

// Get all torrents
app.get("/torrents", function (req, res) {
    const torrents = db.get("torrents").value();
    res.json(torrents);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
