const fs = require('fs');
const path = require('path');
const express = require('express');
const WebTorrent = require('webtorrent');

//torrent client
const client = new WebTorrent();

const router = express.Router();

router.post("/magnet", function (req, res, next) {

    const { magnet } = req.body;

    client.add(magnet, { path: `${__dirname}/loot` }, function (torrent) {
        //selecting mp4 file
        var file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4')
          });
        var filePath = file.path;
        torrent.on('done', function () {
            console.log('finished');

            //setting file path to use in next middleware
            res.locals.filePath = filePath;
            console.log(process.env.BASE_URL);

            res.render('video',{
                base_url: __dirname
            });
            
            
        
        });

    });

    // res.json({ ok: true });

});

module.exports = router;