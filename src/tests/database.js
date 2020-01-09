const { to } = require('await-to-js');
const DatabaseService = require('../utils/db');
const Promise = require('bluebird');
const path = require('path');
const test = require('ava');
const fs = require('fs');

fs.readFileAsync = Promise.promisify(fs.readFile);
fs.unlinkAsync = Promise.promisify(fs.unlink);

test.before((t) => {
    const db = new DatabaseService().getInstance();
    db.start();
})

test("database file should exist", t => {
    const file = fs.existsSync('./db.json');
    t.truthy(file);
});

test("database should contain initial data", async t => {
    const [err, data] = await to(fs.readFileAsync('./db.json'));
    t.truthy(data);
});

test("database should contain predefined data", async t => {
    const schema = { torrents: [], user: {} };
    let [err, data] = await to(fs.readFileAsync('./db.json'));
    data = JSON.parse(data);
    t.deepEqual(data, schema);
})

test.after(async t => {
    const [err] = await to(fs.unlinkAsync(path.join(__dirname, '../../db.json')));
    if (err) console.error(err);
});


