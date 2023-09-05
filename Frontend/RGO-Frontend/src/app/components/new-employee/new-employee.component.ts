import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent {

  constructor(private employeeService: EmployeeService){}

  newEmployeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    initials: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    personalEmail: new FormControl('', Validators.required),
    engagementDate: new FormControl('', Validators.required),
  });

  onSubmit(){
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => {
      },
      error: (error) => {
      }
    })
  }

}
