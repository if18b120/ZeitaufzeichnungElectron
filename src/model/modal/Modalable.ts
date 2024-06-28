import { ModalExitState } from "./ModalExitState";
import { ModalState } from "./ModalState";

export abstract class Modalable {
    isModalable: boolean = true;

    exitCallback: Function | null = null;
    updateCallback: Function | null = null;

    modalState: ModalState = {
        acceptText: "",
        cancelText: "",
        acceptable: false,
        cancelable: false
    }

    abstract acceptCallback(): void;
    abstract cancelCallback(): void;

    setAcceptText(text: string): void {
        this.modalState.acceptText = text;
        this.update();
    }

    setCancelText(text: string): void {
        this.modalState.cancelText = text;
        this.update();
    }

    setAcceptable(acceptable: boolean): void {
        this.modalState.acceptable = acceptable;
        this.update();
    }

    setCancelable(cancelable: boolean): void {
        this.modalState.cancelable = cancelable;
        this.update();
    }

    accept(): void {
        this.acceptCallback();
    }

    cancel(): void {
        this.cancelCallback();
    }

    onExit(exitCallback: Function): void {
        this.exitCallback = exitCallback;
    }

    exit(exitState: ModalExitState): void {
        if (this.exitCallback !== null) {
            this.exitCallback(exitState);
        }
    }

    onUpdate(onUpdateCallback: Function): void {
        this.updateCallback = onUpdateCallback;
    }

    update(): void {
        if (this.updateCallback !== null) {
            this.updateCallback(this.modalState);
        }
    }
}