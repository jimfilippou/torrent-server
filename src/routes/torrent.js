const express = require('express');
const {promisify} = require("util");
const WebTorrent = require('webtorrent');
const FileSync = require('lowdb/adapters/FileSync');
const asyncHandler = require('express-async-handler');
const shortid = require('shortid');
const low = require('lowdb');
// Create the torrent client
const client = new WebTorrent();

// Make promises
promisify(client.add);

//accessing the db
const adapter = new FileSync('db.json');
const db = low(adapter);

// Initiate the router
const router = express.Router();

router.post("/download", asyncHandler(async function (req, res, next) {

    const { magnet } = req.body;

    const torrent = await client.add(magnet, { path: `${__dirname}/loot` });

    torrent.on("download", (bytes) => {
        const percentage = Math.round(torrent.progress * 100 * 100) / 100
        // res.write(percentage.toString());
    });

    torrent.on("done", () => {

        //selecting mp4 file
        let file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4');
          });
        // save on db.json
        const torrentId = shortid.generate();
        db.get('torrents')
        .push({id: torrentId, 
            name : torrent.name, 
            size : torrent.length, 
            path : torrent.path,
            mp4_file: file.path})
        .write();
        res.json(db.get('torrents')
        .find({id:torrentId})
        .value());
        res.end();
    });

}));

module.exports = router;