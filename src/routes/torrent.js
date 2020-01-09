const express = require('express');
const { promisify } = require("util");
const WebTorrent = require('webtorrent');
const asyncHandler = require('express-async-handler');
const shortid = require('shortid');
const Database = require('../utils/db');

const { db } = new Database().getInstance();

// Create the torrent client
const client = new WebTorrent();

// Make promises
promisify(client.add);

// Initiate the router
const router = express.Router();

router.post("/download", asyncHandler(async function (req, res, next) {

    const { magnet } = req.body;

    const torrent = await client.add(magnet, { path: `${__dirname}/loot` });

    torrent.on("done", () => {

        //selecting mp4 file
        let file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4');
        });

        // save on db.json
        const torrentId = shortid.generate();
        const t = {
            id: torrentId,
            name: torrent.name,
            size: torrent.length,
            path: torrent.path,
            mp4_file: file.path
        };

        db.addTorrent(t);
        
        res.json(t);
        res.end();
    });

}));

module.exports = router;