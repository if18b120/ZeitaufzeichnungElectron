import { Injectable } from '@angular/core';
import { Employee } from '../../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }
  getEmployees(): Promise<Employee[]>  {
    return (<any>window).electronAPI.getEmployees();
  }
}
