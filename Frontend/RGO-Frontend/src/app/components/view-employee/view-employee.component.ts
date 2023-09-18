import { Component, Output, EventEmitter } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})

export class ViewEmployeeComponent{
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  Employees: EmployeeProfile[] = [];

  constructor(private employeeService: EmployeeService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getAllProfiles().subscribe(
      data => {
        this.Employees = data
        console.log(this.Employees);
      }
    );
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

}
