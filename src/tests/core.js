const test = require("ava");
const got = require("got");

const URL = 'http://localhost:3000';

test.before(t => {
    // Start server
    require("../index");
});

test("server should be running", async t => {
    const response = await got(`${URL}/ping`);
    const body = response.body;
    t.is(body, "pong");
});


