const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class Database {

    instance = undefined;
    adapter = undefined;
    db = undefined;

    constructor() {

        console.log('Database initiated;');

        // Sync database locally for demo purposes
        this.adapter = new FileSync("db.json");
        this.db = low(this.adapter);

        // Set some defaults (required if your JSON file is empty)
        this.db.defaults({ torrents: [], user: {} }).write();
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