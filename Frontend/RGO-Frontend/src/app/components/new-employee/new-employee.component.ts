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
    email: new FormControl('', Validators.required),
    personalEmail: new FormControl('', Validators.required),
    countryOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    engagementDate: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    cellphoneNo: new FormControl('', Validators.required),
    employeeNumber: new FormControl(''),
    taxNumber: new FormControl(''),
    disabilityNotes: new FormControl(''),
    notes: new FormControl(''),
    photo: new FormControl(''),
  });



  onSubmit(){
    console.log(this.newEmployeeForm.getRawValue().employeeType);
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => {
      },
      error: (error) => {
      }
    })
  }

}
