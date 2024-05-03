import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeSelectComponent } from "./employee-select/employee-select.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { StartupComponent } from "./startup/startup.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, EmployeeSelectComponent, CalendarComponent, StartupComponent]
})
export class AppComponent {
    databaseConnectionEstablished = false;
}
