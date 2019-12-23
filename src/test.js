const test = require("ava");
const got = require("got");

// Start server
require("./index");

const URL = 'http://localhost:3000';

test("Server should be running", async t => {
    const response = await got(`${URL}/ping`);
    const body = response.body;
    t.is(body, "pong");
});

