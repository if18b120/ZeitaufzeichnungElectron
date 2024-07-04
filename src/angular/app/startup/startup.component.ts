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
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    error: Error | null = null;
    private acceptCallback: Function = () => {};
    private cancelCallback: Function = () => {};
    
    constructor(private connectionInitializer: ConnectionInitializerService) {
        super();
    }

    override afterInit() {
        this.acceptableSubject.next(false);
        this.acceptTextSubject.next("");
        this.cancelableSubject.next(false);
        this.cancelTextSubject.next("");
        
        this.input.onShow?.subscribe((show: boolean) => {
            if (show && this.state === ConnectionState.CONNECTING) {
                this.establishConnection();
            }
        });

        this.input.accept?.subscribe((accept: boolean) => {
            if (accept) {
                this.acceptCallback();
            }
        });

        this.input.cancel?.subscribe((cancel: boolean) => {
            if (cancel) {
                this.cancelCallback();
            }
        });
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
            this.exitSubject.next(ModalExitState.SUCCESS);
        }).catch((error) => {
            console.log(error);
            this.error = error;
            this.setState(ConnectionState.FAILED);

            this.acceptableSubject.next(true);
            this.acceptTextSubject.next("Neue Verbindung erstellen");
            this.acceptCallback = () => {
                this.createNew();
            }

            this.cancelableSubject.next(true);
            this.cancelTextSubject.next("Beenden");
            this.cancelCallback = () => {
                this.exitSubject.next(ModalExitState.SHUTDOWN);
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
