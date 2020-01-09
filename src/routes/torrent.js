const express = require('express');
const {promisify} = require("util");
const WebTorrent = require('webtorrent');
const FileSync = require('lowdb/adapters/FileSync');
const asyncHandler = require('express-async-handler');
const shortid = require('shortid');
const low = require('lowdb')
// Create the torrent client
const client = new WebTorrent();

// Make promises
promisify(client.add);

//accessing the db
const adapter = new FileSync('db.json')
const db = low(adapter)

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
        // save on db.json
        db.get('torrents')
        .push({id:shortid.generate(), 
            name : torrent.name, 
            size : torrent.size, 
            path : torrent.path})
        .write();
        res.json(db.get('torrents'));
        res.end();
    })

}));

module.exports = router;