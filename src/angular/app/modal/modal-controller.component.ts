import { Component, EventEmitter, Input, Output, SimpleChanges, Type } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Modalable } from '../../../model/modal/Modalable';
import { Observable } from 'rxjs';
import { ModalExitState } from '../../../model/modal/ModalExitState';

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
    
    @Input() show: boolean = false;

    @Input() onShowObservable: Observable<boolean> | null = null;
    @Input() acceptObservable: Observable<boolean> | null = null;
    @Input() cancelObservable: Observable<boolean> | null = null;

    @Output() acceptableObservable = new EventEmitter<Observable<boolean>>();
    @Output() cancelableObservable = new EventEmitter<Observable<boolean>>();
    @Output() acceptTextObservable = new EventEmitter<Observable<string>>();
    @Output() cancelTextObservable = new EventEmitter<Observable<string>>();
    @Output() exitObservable = new EventEmitter<Observable<ModalExitState>>();

    private modalable: Modalable;

    constructor(private viewRef: ViewContainerRef) {
        if (this.componentType === null) {
            throw new Error('Component type must be set');
        } else if (!this.componentType.prototype.isModalable) {
            throw new Error('Component must be Modalable');
        } else if (this.acceptObservable === null) {
            throw new Error('acceptObservable must be set');
        } else if (this.cancelObservable === null) {
            throw new Error('cancelObservable must be set');
        } else if (this.onShowObservable === null) {
            throw new Error('onShowObservable must be set');
        }
        
        let component = this.viewRef.createComponent(this.componentType);
        this.modalable = component.instance as Modalable;

        this.modalable.input.accept = this.acceptObservable;
        this.modalable.input.cancel = this.cancelObservable;
        this.modalable.input.onShow = this.onShowObservable;

        this.acceptableObservable.emit(this.modalable.output.acceptable);
        this.cancelableObservable.emit(this.modalable.output.cancelable);
        this.acceptTextObservable.emit(this.modalable.output.acceptText);
        this.cancelTextObservable.emit(this.modalable.output.cancelText);
        this.exitObservable.emit(this.modalable.output.exit);
        this.modalable.afterInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["onShowObservable"]) {
            this.modalable.input.onShow = this.onShowObservable;
        }
        if (changes["acceptObservable"]) {
            this.modalable.input.accept = this.acceptObservable;
        }
        if (changes["cancelObservable"]) {
            this.modalable.input.cancel = this.cancelObservable;
        }
        if(this.onShowObservable && this.acceptObservable && this.cancelObservable) {
            this.modalable.afterInit();
        }
    }
}