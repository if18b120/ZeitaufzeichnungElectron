import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { ModalControllerComponent } from "./modal-controller.component";

@Component({
    selector: 'modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    imports: [CommonModule, ModalControllerComponent]
})
export class ModalComponent {
    @Input() componentType: Type<unknown> | null = null;
    acceptCallback: Function | null = null;
    cancelCallback: Function | null = null;

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
}
