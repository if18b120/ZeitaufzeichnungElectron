import { ModalButtonState } from "./ModalButtonState";

export interface ModalState {
    acceptText: string;
    cancelText: string;
    acceptable: ModalButtonState;
    cancelable: ModalButtonState;
}