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
    error?: Error;
    
    constructor(private connectionInitializer: ConnectionInitializerService) {
        this.establishConnection();
    }

    connectionStateEnum(): typeof ConnectionState {
        return ConnectionState;
    }
    
    establishConnection() {
        this.connectionInitializer.openConnection().then((error) => {
            if (error !== null) {
                this.state = ConnectionState.FAILED;
                this.error = error;
            } else {
                this.state = ConnectionState.CONNECTED;
                this.close();
            }
        });
    }
    
    abortInit() {
        this.state = ConnectionState.CRITICAL;
        this.errorMessage = "Eine Datenbankverbindung ist für den Betrieb notwendig!"
    }

    createNew() {
        this.connectionInitializer.createNewConnection().then((error) => {
            if (error != null) {
                this.errorMessage = error.message;
                this.error = error;
                this.state = ConnectionState.CRITICAL;
            } else {
                this.state = ConnectionState.CONFIGURE;
            }
        })
    }

    close() {
        this.connectionStateEmitter.emit(this.error)
    }
}
