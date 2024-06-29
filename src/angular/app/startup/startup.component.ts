import { Component, EventEmitter, Output } from '@angular/core';
import { ConnectionInitializerService } from '../connection-initializer.service';
import { ConnectionState } from '../../../model/ConnectionState';
import { Modalable } from '../../../model/modal/Modalable';
import { ModalExitState } from '../../../model/modal/ModalExitState';

@Component({
    selector: 'startup',
    standalone: true,
    imports: [],
    templateUrl: './startup.component.html',
    styleUrl: './startup.component.scss'
})
export class StartupComponent extends Modalable {
    @Output() connectionStateEvent = new EventEmitter<ConnectionState>();
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    error: Error | null = null;
    
    constructor(private connectionInitializer: ConnectionInitializerService) {
        super();
        this.modalState.acceptable = false;
        this.modalState.cancelable = false;
    }

    override onShowCallback(): void {
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
        this.connectionInitializer.openConnection().then(() => {
            this.setState(ConnectionState.CONNECTED);
            this.exit(ModalExitState.SUCCESS);
        }).catch((error) => {
            console.log(error);
            this.error = error;
            this.setState(ConnectionState.FAILED);

            this.setAcceptable(true);
            this.setAcceptText("Neue Verbindung erstellen");
            this.acceptCallback = () => {
                this.createNew();
            }

            this.setCancelable(true);
            this.setCancelText("Beenden");
            this.cancelCallback = () => {
                this.exit(ModalExitState.SHUTDOWN);
            }
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
}
