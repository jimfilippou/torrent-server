const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const WebTorrent = require("webtorrent");

// Sync database locally for demo purposes
const adapter = new FileSync("db.json");
const db = low(adapter);

//torrent client
const client = new WebTorrent();

// Set some defaults (required if your JSON file is empty)
db.defaults({ torrents: [], user: {} }).write();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Tests if the server is running
app.get("/ping", function (req, res) {
    res.send("pong");
});

// Function for downloading torrent with magnet URI
app.post("/magnet", function (req, res) {

    const { magnet } = req.body;

    client.add(magnet, { path: `${__dirname}/loot` }, function (torrent) {
        torrent.on('done', function () {
            console.log('finished');
        });
    });

    res.json({ ok: true });
});

// Get all torrents
app.get("/torrents", function (req, res) {
    const torrents = db.get("torrents").value();
    res.json(torrents);
});

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}!`));
