import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { gender } from 'src/app/models/constants/gender.constants';
import { general } from 'src/app/models/constants/general.constants';
import { level } from 'src/app/models/constants/level.constants';
import { race } from 'src/app/models/constants/race.constants';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { FieldCode } from 'src/app/models/field-code.interface';
import { EmployeeDataService } from 'src/app/services/employee-data.service';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  @Input() selectedEmployee!: any | null;
  employeeForm!: FormGroup;
  employeeCustomForm!: FormGroup;
  employeeTypes: EmployeeType[] = [];
  public genderTypes = gender;
  public raceTypes = race;
  public generalTypes = general;
  public levelTypes = level;
  employeeData: EmployeeData[] = [];
  fieldcodes: FieldCode[] = [];
  employeeFieldcodes: any = [];
  viewMoreInfo: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private employeeTypeService: EmployeeTypeService,
    private employeeDataService: EmployeeDataService, private fieldcodeService: FieldCodeService
  ) { }

  ngOnInit(): void {
    this.callService();
    this.initializeForm();
    this.employeeForm.disable();
  }

  private callService() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    });
    this.employeeDataService.getEmployeeData(this.selectedEmployee.id).subscribe({
      next: data => {
        this.employeeData = data;
      }
    });
    this.fieldcodeService.getAllFieldCodes().subscribe({
      next: data => {
        this.fieldcodes = data
      }
    });
  }

  private initializeForm() {
    this.employeeForm = this.fb.group({
      title: this.selectedEmployee?.title,
      name: this.selectedEmployee?.name,
      initials: this.selectedEmployee?.initials,
      surname: this.selectedEmployee?.surname,
      email: this.selectedEmployee?.email,
      personalEmail: this.selectedEmployee?.personalEmail,
      countryOfBirth: this.selectedEmployee?.countryOfBirth,
      nationality: this.selectedEmployee?.nationality,
      engagementDate: this.selectedEmployee?.engagementDate,
      employeeType: this.selectedEmployee?.employeeType.name,
      cellphoneNo: this.selectedEmployee?.cellphoneNo,
      employeeNumber: this.selectedEmployee?.employeeNumber,
      taxNumber: this.selectedEmployee?.taxNumber,
      disabilityNotes: this.selectedEmployee?.disabilityNotes,
      disability: this.selectedEmployee.disability == true ? 1 : 0,
      gender: this.selectedEmployee.gender,
      idNumber: this.selectedEmployee.idNumber,
      leaveInterval: this.selectedEmployee.leaveInterval,
      level: this.selectedEmployee.level,
      passportCountryIssue: this.selectedEmployee.passportCountryIssue,
      passportExpirationDate: this.selectedEmployee.passportExpirationDate,
      passportNumber: this.selectedEmployee.passportNumber,
      payrate: this.selectedEmployee.payrate,
      photo: this.selectedEmployee.photo,
      race: this.selectedEmployee.race,
      reportingLine: this.selectedEmployee.reportingLine,
      salary: this.selectedEmployee.salary,
      salaryDays: this.selectedEmployee.salaryDays,
      terminationDate: this.selectedEmployee.terminationDate
    });
  }

  checkEmployeeFieldCode() {
    const formGroupConfig: { [key: string]: any } = {};
    for (const employee of this.employeeData) {
      const found = this.fieldcodes.find((fieldcode) => {
        return fieldcode.id == employee.fieldCodeId
      });
      if (found) {
        const existingRecord = this.employeeFieldcodes.find((value: { name: string }) => value.name === found.name);
        if (!existingRecord) {
          this.employeeFieldcodes.push({ name: found.name, value: employee.value });
        }
      }
    }
    for (const fieldcode of this.fieldcodes) {
      const name = this.formatString(fieldcode.name)
      const fc = this.employeeFieldcodes.find((data: any) => {
        return data.name == fieldcode.name
      });
      if (fc != null) {
        formGroupConfig[name] = fc.value;
      }
      else if (fc == null) {
        formGroupConfig[name] = '';
      }
    }
    this.employeeCustomForm = this.fb.group(formGroupConfig);
    this.employeeCustomForm.disable();
  }

  onSubmit() {
    this.employeeForm.enable();
  }

  viewMore() {
    this.checkEmployeeFieldCode();
    this.viewMoreInfo = true;
  }

  formatString(input: string | undefined): string {
    const words = input?.replace(/['\s]/g, '').split(' ');

    if (words != undefined) {
      for (let i = 0; i < words.length; i++) {
        if (i === 0) {
          words[i] = words[i].toLowerCase();
        }
      }
      return words.join('');
    }
    else return '';
  }
}
