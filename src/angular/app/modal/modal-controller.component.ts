import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Modalable } from '../../../model/modal/Modalable';
import { on } from 'events';

@Component({
    selector: 'modal-controller',
    standalone: true,
    imports: [],
    template: `
    <div style="display: none;"></div>
  `
})
export class ModalControllerComponent {
    @Input() componentType: Type<unknown> | null = null;

    @Input() onExit: Function | null = null;
    @Input() onUpdate: Function | null = null;

    @Output() acceptCallback = new EventEmitter<Function>();
    @Output() cancelCallback = new EventEmitter<Function>();

    private modalable: Modalable;

    constructor(private viewRef: ViewContainerRef) {
        if (this.componentType === null) {
            throw new Error('Component type must be set');
        } else if (!this.componentType.prototype.isModalable) {
            throw new Error('Component must be Modalable');
        } else if (this.onExit === null) {
            throw new Error('onExit must be set');
        } else if (this.onUpdate === null) {
            throw new Error('onUpdate must be set');
        }

        let component = this.viewRef.createComponent(this.componentType);
        this.modalable = component.instance as Modalable;
        this.acceptCallback.emit(this.modalable.accept);
        this.cancelCallback.emit(this.modalable.cancel);
        this.modalable.onExit(this.onExit);
        this.modalable.onUpdate(this.onUpdate);
    }
}