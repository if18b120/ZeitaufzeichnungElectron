import { Component, EventEmitter, Output } from '@angular/core';
import { ConnectionInitializerService } from '../connection-initializer.service';
import { ConnectionState } from '../../../model/ConnectionState';
import { Modalable } from '../../../model/modal/Modalable';
import { ModalExitState } from '../../../model/modal/ModalExitState';
import { FormsModule } from '@angular/forms';
import { ModalButtonState } from '../../../model/modal/ModalButtonState';

@Component({
    selector: 'startup',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './startup.component.html',
    styleUrl: './startup.component.scss'
})
export class StartupComponent extends Modalable {
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    error: Error | null = null;
    private acceptCallback: Function = () => { };
    private cancelCallback: Function = () => { };
    adminPW: string = "";
    adminPWRepeat: string = "";
    passwordsMatch: boolean = false;

    constructor(private connectionInitializer: ConnectionInitializerService) {
        super();
    }

    override afterInit() {
        this.acceptableSubject.next(ModalButtonState.NONE);
        this.acceptTextSubject.next("");
        this.cancelableSubject.next(ModalButtonState.NONE);
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

            this.acceptableSubject.next(ModalButtonState.CLICKABLE);
            this.acceptTextSubject.next("Neue Verbindung erstellen");
            this.acceptCallback = () => {
                this.createNew();
            }

            this.cancelableSubject.next(ModalButtonState.CLICKABLE);
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

            this.acceptableSubject.next(ModalButtonState.NONCLICKABLE);
            this.acceptTextSubject.next("Konfigurieren");
            this.acceptCallback = () => {
                this.configure();
            }

            this.cancelableSubject.next(ModalButtonState.CLICKABLE);
            this.cancelTextSubject.next("Beenden");
            this.cancelCallback = () => {
                this.exitSubject.next(ModalExitState.SHUTDOWN);
            }
        }).catch((error: Error) => {
            this.errorMessage = error.message;
            this.error = error;
            this.setState(ConnectionState.CRITICAL);
        });
    }

    configure() {
        this.connectionInitializer.configureAdminPassword().then(() => {
        }).catch((error: Error) => {
        });
    }

    comparePasswords() {
        if (this.adminPW === this.adminPWRepeat) {
            this.passwordsMatch = true;
            this.acceptableSubject.next(ModalButtonState.CLICKABLE);
        } else {
            this.passwordsMatch = false;
            this.acceptableSubject.next(ModalButtonState.NONCLICKABLE);
        }
    }
}
