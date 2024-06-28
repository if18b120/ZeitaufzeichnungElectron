import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { ModalControllerComponent } from "./modal-controller.component";
import { ModalState } from '../../../model/modal/ModalState';
import { ModalExitState } from '../../../model/modal/ModalExitState';

@Component({
    selector: 'modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    imports: [CommonModule, ModalControllerComponent]
})
export class ModalComponent {
    @Input() componentType: Type<unknown> | null = null;
    @Output() exit = new EventEmitter<ModalExitState>();
    acceptCallback: Function | null = null;
    cancelCallback: Function | null = null;
    modalState: ModalState = {
        acceptText: "",
        cancelText: "",
        acceptable: false,
        cancelable: false
    };

    accept() {
        if (this.acceptCallback !== null) {
            this.acceptCallback();
        }
    }

    cancel() {
        if (this.cancelCallback !== null) {
            this.cancelCallback();
        }
    }

    setAcceptCallback(acceptCallback: Function): void {
        this.acceptCallback = acceptCallback;
    }

    setCancelCallback(cancelCallback: Function): void {
        this.cancelCallback = cancelCallback;
    }

    onUpdate(modalState: ModalState): void {
        this.modalState = modalState;
    }

    onExit(exitState: ModalExitState): void {
        this.exit.emit(exitState);
    }
}
