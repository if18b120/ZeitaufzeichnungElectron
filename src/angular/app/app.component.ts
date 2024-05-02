import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeSelectComponent } from "./employee-select/employee-select.component";
import { CalendarComponent } from "./calendar/calendar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, EmployeeSelectComponent, CalendarComponent]
})
export class AppComponent {
  
}
