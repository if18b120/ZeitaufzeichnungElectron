import { ModalExitState } from "./ExitState";

export interface Modalable {
    isModalable: boolean;
    accept(): void;
    cancel(): void;
    exit(): ModalExitState;
    acceptable(): boolean;
    cancelable(): boolean;
    acceptText(): string;
    cancelText(): string;
    onUpdate(onUpdateCallback: Function): void;
}