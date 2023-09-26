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
    toggleAdditional : boolean = false;

    genders : string[] = ["Male", "Female", "Other"];
    races : string[] = ["Black", "White", "American Indian or Alaska Native", "Latino or Hispanic", "Asian", "Pacific Islander or Hawaiian"];
  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    })
  }

  newEmployeeForm = new FormGroup({
    // title: new FormControl('', Validators.required),
    // name: new FormControl('', Validators.required),
    // initials: new FormControl('', Validators.required),
    // surname: new FormControl('', Validators.required),
    // email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern) ]),
    // personalEmail: new FormControl('', [Validators.required, Validators.email]),
    // countryOfBirth: new FormControl('', Validators.required),
    // nationality: new FormControl('', Validators.required),
    // engagementDate: new FormControl('', Validators.required),
    // employeeType: new FormControl('', Validators.required),
    // cellphoneNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    // employeeNumber: new FormControl(''),
    // taxNumber: new FormControl(''),
    // disabilityNotes: new FormControl(''),
    // notes: new FormControl(''),
    // photo: new FormControl(''),
    engagementDate: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    initials: new FormControl('',Validators.required),
    surname: new FormControl('', Validators.required),
    personalEmail: new FormControl('', [Validators.required, Validators.email]),
    cellphoneNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern) ]),
    employeeNumber: new FormControl(''),
    taxNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    passportExpirationDate: new FormControl(''),
    passportCountryIssue: new FormControl(''),
    terminationDate: new FormControl(''),
    reportingLine: new FormControl(''),
    disability: new FormControl(''),
    disabilityNotes: new FormControl(''),
    level: new FormControl(''),
    notes: new FormControl(''),
    leaveInterval: new FormControl(''),
    salaryInterval: new FormControl(''),
    payRate: new FormControl(''),
    salary: new FormControl(''),
    title: new FormControl(''),
    dateOfBirth: new FormControl(''),
    countryOfBirth: new FormControl(''),
    nationality: new FormControl(''),
    idNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    passportNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    race: new FormControl(''),
    gender: new FormControl(''),
    photo: new FormControl(''),
  });



  onSubmit(){
    this.newEmployeeForm.value.cellphoneNo = this.newEmployeeForm.value.cellphoneNo?.toString();
    this.newEmployeeForm.value.idNumber = this.newEmployeeForm.value.idNumber?.toString();
    this.newEmployeeForm.value.employeeNumber = this.newEmployeeForm.value.employeeNumber?.toString();
    this.newEmployeeForm.value.taxNumber = this.newEmployeeForm.value.taxNumber?.toString();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => { },
      error: (error) => {
      }
    })
  }

}
