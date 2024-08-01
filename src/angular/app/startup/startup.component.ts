import { Component, EventEmitter, Output } from '@angular/core';
import { ConnectionInitializerService } from '../connection-initializer.service';
import { ConnectionState } from '../../../model/ConnectionState';
import { Modalable } from '../../../model/modal/Modalable';
import { ModalExitState } from '../../../model/modal/ModalExitState';
import { FormsModule } from '@angular/forms';
import { ModalButtonState } from '../../../model/modal/ModalButtonState';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'startup',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './startup.component.html',
    styleUrl: './startup.component.scss'
})
export class StartupComponent extends Modalable {
    state: ConnectionState = ConnectionState.CONNECTING;
    errorMessage: String = "";
    private acceptCallback: Function = () => { };
    private cancelCallback: Function = () => { };
    adminPW: string = "";
    adminPWRepeat: string = "";
    passwordsMatch: boolean = false;

    constructor(private connectionInitializer: ConnectionInitializerService) {
        super();
        this.establishConnection();
    }

    override afterInit() {
        this.titleSubject.next("");
        this.acceptableSubject.next(ModalButtonState.NONE);
        this.acceptTextSubject.next("");
        this.cancelableSubject.next(ModalButtonState.NONE);
        this.cancelTextSubject.next("");

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
        this.state = state;
    }

    establishConnection() {
        this.connectionInitializer.openConnection().then(() => {
            this.connectionInitializer.isAdminPasswordSet().then((isSet) => {
                if (isSet) {
                    this.setConnectedState();
                } else {
                    this.setConfigureState();
                }
            }).catch((error: Error) => {
                this.setCrititcalState(error);
            });
        }).catch((error: Error) => {
            this.setFailedState();
        });
    }
    
    createNew() {
        this.connectionInitializer.createNewConnection().then(() => {
            this.setConfigureState();
        }).catch((error: Error) => {
            this.setCrititcalState(error);
        });
    }

    setConfigureState() {
        this.setState(ConnectionState.CONFIGURE);
        
        this.titleSubject.next("Konfiguration");
        this.acceptableSubject.next(ModalButtonState.NONCLICKABLE);
        this.acceptTextSubject.next("Konfigurieren");
        this.acceptCallback = () => {
            this.connectionInitializer.configureAdminPassword(this.adminPW).then(() => {
                this.setConnectedState();
            }).catch((error: Error) => {
                
            });
        }
        
        this.cancelableSubject.next(ModalButtonState.CLICKABLE);
        this.cancelTextSubject.next("Beenden");
        this.cancelCallback = () => {
            this.abortInit();
        }
    }

    setConnectedState(): void {
        this.setState(ConnectionState.CONNECTED);
        this.exitSubject.next(ModalExitState.SUCCESS);
    }
    
    abortInit() {
        this.setCrititcalState(new Error("Der Verbindungsaufbau wurde abgebrochen!"));
    }

    setCrititcalState(error: Error): void {
        this.setState(ConnectionState.CRITICAL);
        this.titleSubject.next("Ein Unerwarteter Fehler ist aufgetreten!");
        this.acceptableSubject.next(ModalButtonState.NONE);

        this.cancelableSubject.next(ModalButtonState.CLICKABLE);
        this.cancelTextSubject.next("Beenden");
        this.cancelCallback = () => {
            this.exitSubject.next(ModalExitState.SHUTDOWN);
        }
        this.errorMessage = error.message;
    }

    setFailedState(): void {
        this.setState(ConnectionState.FAILED);

        this.titleSubject.next("Verbindungsaufbau fehlgeschlagen!");
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
