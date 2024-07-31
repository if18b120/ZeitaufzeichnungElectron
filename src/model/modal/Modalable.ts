import { Observable, Subject } from "rxjs";
import { ModalExitState } from "./ModalExitState";
import { ModalButtonState } from "./ModalButtonState";

export abstract class Modalable {
    isModalable: boolean = true;

    input = {
        accept: null as Observable<boolean> | null,
        cancel: null as Observable<boolean> | null,
        onShow: null as Observable<boolean> | null
    }

    protected titleSubject: Subject<string> = new Subject<string>();
    protected acceptableSubject: Subject<ModalButtonState> = new Subject<ModalButtonState>();
    protected cancelableSubject: Subject<ModalButtonState> = new Subject<ModalButtonState>();
    protected acceptTextSubject: Subject<string> = new Subject<string>();
    protected cancelTextSubject: Subject<string> = new Subject<string>();
    protected exitSubject: Subject<ModalExitState> = new Subject<ModalExitState>();

    output = {
        title: this.titleSubject.asObservable(),
        acceptable: this.acceptableSubject.asObservable(),
        cancelable: this.cancelableSubject.asObservable(),
        acceptText: this.acceptTextSubject.asObservable(),
        cancelText: this.cancelTextSubject.asObservable(),
        exit: this.exitSubject.asObservable()
    }

    abstract afterInit(): void;
}