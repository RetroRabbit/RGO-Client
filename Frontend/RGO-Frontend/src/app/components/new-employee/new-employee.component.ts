import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService, 
    private employeeTypeService: EmployeeTypeService){}

    employeeTypes: EmployeeType[] = [];
    emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    })
  }

  newEmployeeForm = new FormGroup({
    title: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    initials: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern) ]),
    personalEmail: new FormControl('', [Validators.required, Validators.email]),
    countryOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    engagementDate: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    cellphoneNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    employeeNumber: new FormControl(''),
    taxNumber: new FormControl(''),
    disabilityNotes: new FormControl(''),
    notes: new FormControl(''),
    photo: new FormControl(''),
  });



  onSubmit(){
    this.newEmployeeForm.value.cellphoneNo = this.newEmployeeForm.value.cellphoneNo?.toString();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => { },
      error: (error) => {
      }
    })
  }

}
