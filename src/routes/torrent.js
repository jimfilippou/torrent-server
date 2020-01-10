const express = require('express');
const { to } = require('await-to-js');
const Promise = require("bluebird");
const WebTorrent = require('webtorrent');
const asyncHandler = require('express-async-handler');
const shortid = require('shortid');
const Database = require('../utils/db');

const  db  = new Database().getInstance();

// Create the torrent client
const client = new WebTorrent();

// Make promises
client.addAsync = Promise.promisify(client.add);

// Initiate the router
const router = express.Router();

//client posts magnet, torrent is added and metadata are sent
router.post("/download", async function (req, res) {

    const { magnet } = req.body;

    const [err, torrent] = await to(client.addAsync(magnet, { path: `${__dirname}/loot` }));
    
    if (err) {
        const firstTorrent = db.getTorrents()[0];
        res.json(firstTorrent);
        return;
    }

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
            mp4_file: file.path,
        };

        db.addTorrent(t);
        
        res.json(t);
        res.end();
    });

});
module.exports = router;