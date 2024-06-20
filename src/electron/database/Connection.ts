import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";
import * as fs from "fs";

export class Connection {
    private db?: Database;

    open() {
        this.db = new Database('./db/database.sqlite', OPEN_READWRITE);
    }

    create() {
        this.db = new Database('./db/database.sqlite', OPEN_CREATE);
        this.db.exec(fs.readFileSync(__dirname + '/sql/initial-state.sql').toString());
    }
}