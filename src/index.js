const express = require("express");

// Routes
const torrentController = require("./routes/torrent");
const videoController = require("./routes/video");

// Initiate express instance
const app = express();
const port = 3000;

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// @TODO Remove the following lines
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

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}!`));
