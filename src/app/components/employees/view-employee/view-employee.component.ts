import { Component, Output, EventEmitter } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})

export class ViewEmployeeComponent{
  // @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  @Output() selectedEmployee = new EventEmitter<any>()
  Employees: EmployeeProfile[] = [];
  selectedEmp: any;

  constructor(private employeeService: EmployeeService,
    private cookieService: CookieService, private router: Router) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getAllProfiles().subscribe({
      next: data => {
        this.Employees = data;
      }
  });
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    console.log(target.innerText);
    this.cookieService.set('currentPage', target.innerText);
  }

  ViewUser(email: string){
    this.cookieService.set('selectedUser',email)
  }

  employeeClickEvent(event: any, employee: EmployeeProfile): void{
    this.selectedEmp = employee
    this.selectedEmployee.emit(this.selectedEmp)
    this.cookieService.set('currentPage', 'Employee Details');
  }
  

}
