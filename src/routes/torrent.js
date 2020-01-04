const fs = require('fs');
const path = require('path');
const express = require('express');
const WebTorrent = require('webtorrent');

//torrent client
const client = new WebTorrent();

const router = express.Router();

router.post("/magnet", function (req, res) {

    const { magnet } = req.body;

    client.add(magnet, { path: `${__dirname}/loot` }, function (torrent) {
        torrent.on('done', function () {
            console.log('finished');
        });
    });

    res.json({ ok: true });

});

module.exports = router;