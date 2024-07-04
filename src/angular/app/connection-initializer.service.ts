import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConnectionInitializerService {

    constructor() { }

    openConnection(): Promise<Error | null> {
        return (<any>window).electronAPI.openConnection();
    }

    createNewConnection(): Promise<Error | null> {
        return (<any>window).electronAPI.createNewConnection();
    }

    configureAdminPassword(): Promise<Error | null> {
        return (<any>window).electronAPI.configureAdminPassword();
    }

    checkAdminPassword(): Promise<Error | null> {
        return (<any>window).electronAPI.checkAdminPassword();
    }
}
