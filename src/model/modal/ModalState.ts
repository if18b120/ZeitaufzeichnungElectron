import { ModalButtonState } from "./ModalButtonState";

export interface ModalState {
    title: string;
    acceptText: string;
    cancelText: string;
    acceptable: ModalButtonState;
    cancelable: ModalButtonState;
}