// Library imports
const express = require("express");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// Initiate DB
const adapter = new FileSync('db.json')
const db = low(adapter)

// Route imports
const torrentController = require("./routes/torrent");
const videoController = require("./routes/video");

// Initiate express instance
const app = express();
const port = 3000;

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.defaults({
    torrents:[]
})
.write();

app.engine('pug', require('pug').__express);
app.set('views', __dirname+'\\views');
app.set('view engine', 'pug');

// Add custom controllers to handlers
app.use('/torrent', torrentController);
app.use('/video', videoController);

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
