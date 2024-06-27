import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Modalable } from '../../../model/Modalable';

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
    @Input() show = false;
    @Input() accept: Function | null = null;
    
    @Output() onClose = new EventEmitter<void>();
    @Output() acceptCallback = new EventEmitter<Function>();
    @Output() cancelCallback = new EventEmitter<Function>();

    private modalable: Modalable | null = null;
    acceptable: boolean = false;
    cancelable: boolean = false;
    acceptText: string = "";
    cancelText: string = "";

    constructor(private viewRef: ViewContainerRef) {
        if (this.componentType === null) {
            throw new Error('Component type must be set');
        } else if (this.componentType.prototype.isModalable === undefined) {
            throw new Error('Component must implement Modalable');
        }
        let component = this.viewRef.createComponent(this.componentType);
        this.modalable = component.instance as Modalable;
        this.modalable.onUpdate(() => this.update());
        this.update();
        this.acceptCallback.emit(this.modalable.accept);
    }

    update() {
        if (this.modalable !== null) {
            this.acceptable = this.modalable.acceptable();
            this.cancelable = this.modalable.cancelable();
            this.acceptText = this.modalable.acceptText();
            this.cancelText = this.modalable.cancelText();
        }
    }

    close() {
        this.onClose.emit();
    }
}