const express = require('express');
const path = require('path');
const shortid = require('shortid');
const Database = require('../utils/db');
const WebTorrent = require('webtorrent');

const db = new Database().getInstance();

// Initiate the router
const router = express.Router();

//client posts magnet, torrent is added and metadata are sent
router.post("/download", async (req, res) => {

    const client = new WebTorrent();

    client.on("error", (err) => {
        err instanceof Error ? res.json({ err: err.message }) : res.json({ err });
        res.end();
    })

    const { magnet } = req.body;
    const pathToSave = path.join(__dirname, '../../loot');

    client.add(magnet, { path: pathToSave }, (torrent) => {

        torrent.on("done", () => {

            console.info("Torrent downloaded successfully!");

            // Find mp4 file
            const file = torrent.files.find(f => f.name.endsWith('.mp4'))

            // Find subtitles
            const subs = torrent.files.filter(f => f.name.endsWith('.srt')).map(s => s.name)

            const t = {
                id: shortid.generate(),
                magnet: magnet,
                name: torrent.name,
                size: torrent.length,
                path: torrent.path,
                mp4_file: file.path,
                subs: subs
            };

            const existingTorrent = db.getTorrentByMagnet(t.magnet);

            if (!existingTorrent) {
                db.addTorrent(t);
                res.json(t);
            } else {
                res.json(existingTorrent)
            }

            res.end();
        });

    })

});
module.exports = router;