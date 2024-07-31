import sqlite3 from "sqlite3";
const { OPEN_READWRITE, OPEN_CREATE } = sqlite3;
import * as fs from "fs";
import { AdminDto } from "../../model/dto/AdminDto";

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

    create(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db = new sqlite3.Database('./dist/database.sqlite', OPEN_READWRITE | OPEN_CREATE, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }).then(() => {
            fs.readFile('./dist/initial-state.sql', 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                this.db?.exec(data, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            });
        })
    }

    checkAdminPassword(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db?.get("SELECT * FROM ADMIN", (err, row: AdminDto) => {
                console.log(err);
                console.log(row);
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    insertAdminPassword(password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db?.get("SELECT * FROM ADMIN", (err, row: AdminDto) => {
                if (err) {
                    reject(err);
                } else if (row !== undefined) {
                    reject(new Error("Admin row already exists!"));
                } else {
                    resolve();
                }
            });
        }).then(() => {
            console.log(password);
            this.db?.run("INSERT INTO ADMIN (PASSWORD) VALUES (?)", [password], (err) => {
                if (err) {
                    throw err;
                }
            });
        });

    }
    close() {
        this.db?.close();
    }
}