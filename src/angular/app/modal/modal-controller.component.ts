import { Component, EventEmitter, Input, Output, SimpleChanges, Type } from "@angular/core";
import { ViewContainerRef } from "@angular/core";
import { Modalable } from "../../../model/modal/Modalable";
import { Observable } from "rxjs";
import { ModalExitState } from "../../../model/modal/ModalExitState";
import { ModalButtonState } from "../../../model/modal/ModalButtonState";

@Component({
    selector: "modal-controller",
    standalone: true,
    imports: [],
    template: ` <div style="display: none;"></div> `,
})
export class ModalControllerComponent {
    @Input() componentType: Type<unknown> | null = null;

    @Input() show: boolean = false;

    @Input() onShowObservable: Observable<boolean> | null = null;
    @Input() acceptObservable: Observable<boolean> | null = null;
    @Input() cancelObservable: Observable<boolean> | null = null;

    @Output() acceptableObservable = new EventEmitter<Observable<ModalButtonState>>();
    @Output() cancelableObservable = new EventEmitter<Observable<ModalButtonState>>();
    @Output() acceptTextObservable = new EventEmitter<Observable<string>>();
    @Output() cancelTextObservable = new EventEmitter<Observable<string>>();
    @Output() exitObservable = new EventEmitter<Observable<ModalExitState>>();
    @Output() titleObservable = new EventEmitter<Observable<string>>();

    private modalable: Modalable | null = null;
    private initialized: boolean = false;

    constructor(private viewRef: ViewContainerRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["onShowObservable"] && this.modalable) {
            this.modalable.input.onShow = this.onShowObservable;
        }
        if (changes["acceptObservable"] && this.modalable) {
            this.modalable.input.accept = this.acceptObservable;
        }
        if (changes["cancelObservable"] && this.modalable) {
            this.modalable.input.cancel = this.cancelObservable;
        }
        if (this.componentType && this.onShowObservable && this.acceptObservable && this.cancelObservable && !this.initialized) {
            this.initialized = true;
            let component = this.viewRef.createComponent(this.componentType);
            this.modalable = component.instance as Modalable;

            this.modalable.input.accept = this.acceptObservable;
            this.modalable.input.cancel = this.cancelObservable;
            this.modalable.input.onShow = this.onShowObservable;

            this.titleObservable.emit(this.modalable.output.title);
            this.acceptableObservable.emit(this.modalable.output.acceptable);
            this.cancelableObservable.emit(this.modalable.output.cancelable);
            this.acceptTextObservable.emit(this.modalable.output.acceptText);
            this.cancelTextObservable.emit(this.modalable.output.cancelText);
            this.exitObservable.emit(this.modalable.output.exit);
            this.modalable.afterInit();
        }
    }
}
