import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeSelectComponent } from "./employee-select/employee-select.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { StartupComponent } from "./startup/startup.component";
import { ConnectionState } from '../../model/ConnectionState';
import { TerminatorService } from './terminator.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, EmployeeSelectComponent, CalendarComponent, StartupComponent]
})
export class AppComponent {
    databaseConnectionEstablished = false;

    constructor(private terminatorService: TerminatorService) { }

    onDatabaseConnectionEstablished(state: ConnectionState) {
        if (state === ConnectionState.CONNECTED) {
            this.databaseConnectionEstablished = true;
        } else {
            this.terminatorService.shutdown();
        }
    }
}
