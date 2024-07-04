import { Component, Type } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EmployeeSelectComponent } from "./employee-select/employee-select.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { StartupComponent } from "./startup/startup.component";
import { ConnectionState } from "../../model/ConnectionState";
import { TerminatorService } from "./terminator.service";
import { ModalComponent } from "./modal/modal.component";
import { ModalExitState } from "../../model/modal/ModalExitState";

@Component({
    selector: "app-root",
    standalone: true,
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    imports: [
        RouterOutlet,
        EmployeeSelectComponent,
        CalendarComponent,
        StartupComponent,
        ModalComponent,
    ],
})
export class AppComponent {
    databaseConnectionEstablished = false;
    showStartupModal = false;
    startupComponent: Type<unknown> = StartupComponent;

    constructor(private terminatorService: TerminatorService) { }

    onDatabaseConnectionEstablished(state: ConnectionState) {
        switch (state) {
            case ConnectionState.CONNECTED:
                this.databaseConnectionEstablished = true;
                break;
            case ConnectionState.CRITICAL:
                this.terminatorService.shutdown();
                break;
            default:
                break;
        }
    }

    exit($event: ModalExitState) {
        if ($event === ModalExitState.SUCCESS) {
            this.showStartupModal = false;
        } else {
            this.terminatorService.shutdown();
        }
    }

    makeVisible() {
        this.showStartupModal = true;
    }
}
