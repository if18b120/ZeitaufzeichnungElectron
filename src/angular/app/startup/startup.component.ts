import { Component, EventEmitter, Output } from '@angular/core';
import { ConnectionInitializerService } from '../connection-initializer.service';
import { ConnectionState } from '../../../model/ConnectionState';

@Component({
    selector: 'startup',
    standalone: true,
    imports: [],
    templateUrl: './startup.component.html',
    styleUrl: './startup.component.scss'
})
export class StartupComponent implements Modalable {
    @Output() connectionStateEvent = new EventEmitter<ConnectionState>();
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    error: Error | null = null;
    isModalable: boolean = true;

    constructor(private connectionInitializer: ConnectionInitializerService) {
        this.establishConnection();
    }

    onUpdate(onUpdateCallback: Function): void {
        throw new Error('Method not implemented.');
    }

    accept(): void {
        throw new Error('Method not implemented.');
    }
    
    cancel(): void {
        throw new Error('Method not implemented.');
    }

    acceptable(): boolean {
        return true;
    }

    cancelable(): boolean {
        return true;
    }

    acceptText(): string {
        throw new Error('Method not implemented.');
    }

    cancelText(): string {
        throw new Error('Method not implemented.');
    }

    connectionStateEnum(): typeof ConnectionState {
        return ConnectionState;
    }

    setState(state: ConnectionState) {
        console.log("Setting state to " + state);
        this.state = state;
    }

    establishConnection() {
        this.connectionInitializer.openConnection().then((error) => {
            console.log("connected");
            console.log(error);
            this.setState(ConnectionState.CONNECTED);
            this.close();
        }).catch((error) => {
            console.log("connection failed");
            console.log(error);
            this.error = error;
            this.setState(ConnectionState.FAILED);
        });
    }

    abortInit() {
        this.setState(ConnectionState.CRITICAL);
        this.errorMessage = "Eine Datenbankverbindung ist für den Betrieb notwendig!"
    }

    createNew() {
        this.connectionInitializer.createNewConnection().then(() => {
            this.setState(ConnectionState.CONFIGURE);
        }).catch((error: Error) => {
            this.errorMessage = error.message;
            this.error = error;
            this.setState(ConnectionState.CRITICAL);
        });
    }

    close() {
        this.connectionStateEvent.emit(this.state);
    }
}
