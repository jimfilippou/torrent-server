const test = require("ava");
const got = require("got");

// Start server
require("./index");

const URL = 'http://localhost:3000';

// test("Server should be running", async t => {
//     const response = await got(`${URL}/ping`);
//     const body = response.body;
//     t.is(body, "pong");
// });


test("Torrent should be downloaded via magnet", async t =>{
    const response = await got.post(`${URL}/magnet`,{
        json: {
            magnet:'magnet:?xt=urn:btih:7fbc58e324b539bdda58c15bda3acd26b0d5fbd1&dn=Luis+Fonsi+-+Despacito+%28feat.+Daddy+Yankee%29&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
        }
    });
    console.log(response.body);
    const body = response.body;
});

