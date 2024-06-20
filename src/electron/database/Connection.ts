import sqlite3 from "sqlite3";
const { OPEN_READWRITE, OPEN_CREATE } = sqlite3;
import * as fs from "fs";

export class Connection {
    private db?: sqlite3.Database;

    open(): Promise<Error | null> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database('./dist/database.sqlite', OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
    }

    create(): Promise<Error | null>{
        return new Promise<Error | null>((resolve, reject) => {
            console.log(`Current directory: ${process.cwd()}`);
            console.log(OPEN_CREATE);

            this.db = new sqlite3.Database('./dist/database.sqlite', OPEN_READWRITE | OPEN_CREATE, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        }).then(() => {
            return new Promise<Error | null>((resolve, reject) => {
                fs.readFile('./dist/initial-state.sql', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.db?.exec(data, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(null);
                            }
                        });
                    }
                });
            });
        }).catch((err: Error) => {
            return new Promise<Error | null>((resolve) => {
                resolve(err);
            });
        });
    }

    close() {
        this.db?.close();
    }
}