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
    title: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    initials: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    personalEmail: new FormControl('', Validators.required),
    countryOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    engagementDate: new FormControl('', Validators.required),
    employeeNumber: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    taxNumber: new FormControl('', Validators.required),
    cellphoneNo: new FormControl('', Validators.required)
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
