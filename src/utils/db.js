const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class Database {

    instance = undefined;
    adapter = undefined;
    db = undefined;

    constructor() {
        // Sync database locally
        this.adapter = new FileSync("db.json");
        this.db = low(this.adapter);
    }

    start() {
        // Set some defaults (required if your JSON file is empty)
        this.db.defaults({ torrents: [], user: {} }).write();
    }

    addTorrent(torrent) {
        this.db.get('torrents')
            .push(torrent)
            .write();
    }

    getTorrents() {
        return this.db.get('torrents').read();
    }

}

class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Database();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}


module.exports = Singleton;