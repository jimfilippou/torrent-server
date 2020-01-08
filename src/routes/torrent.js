const express = require('express');
const {promisify} = require("util");
const WebTorrent = require('webtorrent');
const asyncHandler = require('express-async-handler');

// Create the torrent client
const client = new WebTorrent();

// Make promises
promisify(client.add);

// Initiate the router
const router = express.Router();

router.post("/download", asyncHandler(async function (req, res, next) {

    const { magnet } = req.body;

    const torrent = await client.add(magnet, { path: `${__dirname}/loot` });

    torrent.on("download", (bytes) => {
        const percentage = Math.round(torrent.progress * 100 * 100) / 100
        res.write(percentage.toString());
    });

    torrent.on("done", () => {
        // save on db.json
        res.json({name: torrent.name});
        res.end();
    })

}));

module.exports = router;