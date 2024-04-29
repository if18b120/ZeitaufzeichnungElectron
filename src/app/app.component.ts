import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeSelectComponent } from "./employee-select/employee-select.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, EmployeeSelectComponent]
})
export class AppComponent {
  
}
