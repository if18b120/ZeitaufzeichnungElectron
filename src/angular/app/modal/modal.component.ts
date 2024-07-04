import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    Type,
} from "@angular/core";
import { ModalControllerComponent } from "./modal-controller.component";
import { ModalState } from "../../../model/modal/ModalState";
import { ModalExitState } from "../../../model/modal/ModalExitState";
import { Observable, Subject } from "rxjs";
import { ModalButtonState } from "../../../model/modal/ModalButtonState";

@Component({
    selector: "modal",
    standalone: true,
    templateUrl: "./modal.component.html",
    styleUrl: "./modal.component.scss",
    imports: [CommonModule, ModalControllerComponent],
})
export class ModalComponent {
    @Input() componentType: Type<unknown> | null = null;
    @Input() isVisible: boolean = false;

    @Output() exit = new EventEmitter<ModalExitState>();

    onShowSubject: Subject<boolean> = new Subject<boolean>();
    acceptSubject: Subject<boolean> = new Subject<boolean>();
    cancelSubject: Subject<boolean> = new Subject<boolean>();

    modalState: ModalState = {
        acceptable: ModalButtonState.NONE,
        cancelable: ModalButtonState.NONE,
        acceptText: "",
        cancelText: "",
    };

    modalButtonStateEnum: typeof ModalButtonState = ModalButtonState;

    ngOnChanges(changes: SimpleChanges) {
        if (changes["isVisible"]) {
            this.onShowSubject.next(this.isVisible);
        }
    }

    setAcceptableObservable(observable: Observable<ModalButtonState>) {
        observable.subscribe((value: ModalButtonState) => {
            this.modalState.acceptable = value;
        });
    }

    setCancelableObservable(observable: Observable<ModalButtonState>) {
        observable.subscribe((value: ModalButtonState) => {
            this.modalState.cancelable = value;
        });
    }

    setAcceptTextObservable(observable: Observable<string>) {
        observable.subscribe((value: string) => {
            this.modalState.acceptText = value;
        });
    }

    setCancelTextObservable(observable: Observable<string>) {
        observable.subscribe((value: string) => {
            this.modalState.cancelText = value;
        });
    }

    setExitObservable(observable: Observable<ModalExitState>) {
        observable.subscribe((value: ModalExitState) => {
            this.exit.emit(value);
        });
    }
}
