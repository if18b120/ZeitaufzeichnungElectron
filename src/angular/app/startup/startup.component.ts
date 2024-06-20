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
export class StartupComponent {
    @Output() connectionStateEmitter = new EventEmitter<Error | null>();
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    error: Error | null = null;

    constructor(private connectionInitializer: ConnectionInitializerService) {
        this.establishConnection();
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
        this.connectionInitializer.createNewConnection().then((error) => {
            if (error != null) {
                this.errorMessage = error.message;
                this.error = error;
                this.setState(ConnectionState.CRITICAL);
            } else {
                this.setState(ConnectionState.CONFIGURE);
            }
        })
    }

    close() {
        this.connectionStateEmitter.emit(this.error)
    }
}
