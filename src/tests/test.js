const test = require("ava");
const got = require("got");

// Start server
require("../index");

const URL = 'http://localhost:3000';

test("server should be running", async t => {
    const response = await got(`${URL}/ping`);
    const body = response.body;
    t.is(body, "pong");
});

test("torrent should start downloading via magnet", async t => {

    const { body } = await got.post(`${URL}/torrent/magnet`, {
        json: {
            magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
        },
        responseType: 'json'
    });

    t.is(body.ok, true);
});

