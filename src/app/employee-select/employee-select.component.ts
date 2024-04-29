import { Component } from '@angular/core';
import { Employee } from '../model/Employee';
import { EmployeeService } from '../employee.service';

@Component({
    selector: 'employee-select',
    standalone: true,
    imports: [],
    templateUrl: './employee-select.component.html',
    styleUrl: './employee-select.component.scss'
})
export class EmployeeSelectComponent {
    constructor(private employeeService: EmployeeService){}
    employees: Employee[] = this.employeeService.getEmployees()
}
