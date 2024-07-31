import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConnectionInitializerService {

    constructor() { }

    openConnection(): Promise<void> {
        return (<any>window).electronAPI.openConnection();
    }

    createNewConnection(): Promise<void> {
        return (<any>window).electronAPI.createNewConnection();
    }

    configureAdminPassword(password: String): Promise<void> {
        return (<any>window).electronAPI.configureAdminPassword(password);
    }

    isAdminPasswordSet(): Promise<boolean> {
        return (<any>window).electronAPI.isAdminPasswordSet();
    }
}
