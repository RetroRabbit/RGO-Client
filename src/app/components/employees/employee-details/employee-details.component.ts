import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { gender } from 'src/app/models/constants/gender.constants';
import { general } from 'src/app/models/constants/general.constants';
import { level } from 'src/app/models/constants/level.constants';
import { race } from 'src/app/models/constants/race.constants';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { FieldCode } from 'src/app/models/field-code.interface';
import { EmployeeDataService } from 'src/app/services/employee-data.service';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
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
  toEdit: boolean = false;

  constructor(private fb: FormBuilder, private employeeTypeService: EmployeeTypeService,
    private employeeDataService: EmployeeDataService, private fieldcodeService: FieldCodeService, 
    private employeeService: EmployeeService, private cookieService: CookieService
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
      payRate: this.selectedEmployee.payRate,
      photo: this.selectedEmployee.photo,
      race: this.selectedEmployee.race,
      reportingLine: this.selectedEmployee.reportingLine,
      salary: this.selectedEmployee.salary,
      salaryDays: this.selectedEmployee.salaryDays,
      terminationDate: this.selectedEmployee.terminationDate,
      dateOfBirth: this.selectedEmployee.dateOfBirth
    });
  }

  // checkEmployeeFieldCode() {
  //   const formGroupConfig: { [key: string]: any } = {};
  //   for (const employee of this.employeeData) {
  //     const found = this.fieldcodes.find((fieldcode) => {
  //       return fieldcode.id == employee.fieldCodeId
  //     });
  //     if (found) {
  //       const existingRecord = this.employeeFieldcodes.find((value: { name: string }) => value.name === found.name);
  //       if (!existingRecord) {
  //         this.employeeFieldcodes.push({ name: found.name, value: employee.value });
  //       }
  //     }
  //   }
  //   for (const fieldcode of this.fieldcodes) {
  //     const name = this.formatString(fieldcode.name)
  //     const fc = this.employeeFieldcodes.find((data: any) => {
  //       return data.name == fieldcode.name
  //     });
  //     if (fc != null) {
  //       formGroupConfig[name] = fc.value;
  //     }
  //     else if (fc == null) {
  //       formGroupConfig[name] = '';
  //     }
  //   }
  //   this.employeeCustomForm = this.fb.group(formGroupConfig);
  //   this.employeeCustomForm.disable();
  // }

  checkEmployeeFieldCode() {
    for (const fieldcode of this.fieldcodes) {
      const name = this.formatString(fieldcode.name)
      const fc = this.employeeData.find((data) => {
        return data.fieldCodeId == fieldcode.id
      });
      this.employeeForm.addControl(name, this.fb.control(fc ? fc.value : ''));
    }
    this.employeeForm.disable();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeForm = this.employeeForm.value;

      const employeeProfileDto = {
        id: this.selectedEmployee.id,
        employeeNumber: employeeForm.employeeNumber,
        taxNumber: employeeForm.taxNumber,
        engagementDate: employeeForm.engagementDate,
        terminationDate: employeeForm.terminationDate,
        reportingLine: employeeForm.reportingLine,
        disability: parseInt(employeeForm.disability) == 0 ? false : true,
        disabilityNotes: employeeForm.disabilityNotes,
        countryOfBirth: employeeForm.countryOfBirth,
        nationality: employeeForm.nationality,
        level: parseInt(employeeForm.level),
        employeeType: {
          id: this.selectedEmployee.employeeType.id,
          name: employeeForm.employeeType,
        },
        title: employeeForm.title,
        name: employeeForm.name,
        initials: employeeForm.initials,
        surname: employeeForm.surname,
        dateOfBirth: employeeForm.dateOfBirth,
        idNumber: employeeForm.idNumber,
        passportNumber: employeeForm.passportNumber,
        passportExpirationDate: employeeForm.passportExpirationDate,
        passportCountryIssue: employeeForm.passportCountryIssue,
        race: parseInt(employeeForm.race),
        gender: parseInt(employeeForm.gender),
        email: employeeForm.email,
        personalEmail: employeeForm.personalEmail,
        cellphoneNo: employeeForm.cellphoneNo,
        photo: employeeForm.photo,
        notes: '',
        leaveInterval: employeeForm.leaveInterval,
        salary: employeeForm.salary,
        salaryDays: employeeForm.salaryDays,
        payRate: employeeForm.payrate
      }
      console.log(employeeProfileDto)
      this.employeeService.updateEmployee(employeeProfileDto).subscribe({
        next: (data) => {
          console.log("this works")
        },
        error: (error) => {
          console.log(error)
          console.log("this does not work")
        }
      });
      this.saveEmployeeCustomData();
    }
    this.cookieService.set('currentPage', 'People');
  }

  saveEmployeeCustomData() {
    for (const fieldcode of this.fieldcodes) {
      const found = this.employeeData.find((data) => {
        return fieldcode.id == data.fieldCodeId
      });

      if (found != null) {
        const formatFound = this.formatString(fieldcode?.name)
        const employeeDataDto = {
          id: found.id,
          employeeId: found.employeeId,
          fieldcodeId: found.fieldCodeId,
          value: this.employeeForm.get(formatFound)?.value
        }
        console.log(employeeDataDto)
        this.employeeDataService.updateEmployeeData(employeeDataDto).subscribe({
          next: (data) => {
            console.log("employee data updated")
          },
          error: (error) => {
            console.log(error)
            console.log("employee data not updated")
          }
        });
      }
      else if (found == null) {
        const formatFound = this.formatString(fieldcode?.name)
        const employeeDataDto = {
          id: 0,
          employeeId: this.selectedEmployee.id,
          fieldcodeId: fieldcode.id,
          value: this.employeeForm.get(formatFound)?.value
        }
        if (employeeDataDto.value != '') {
          console.log(employeeDataDto)
          this.employeeDataService.saveEmployeeData(employeeDataDto).subscribe({
            next: (data) => {
              console.log("employee data saved")
            },
            error: (error) => {
              console.log(error)
              console.log("employee data not saved")
            }
          });
        }

      }
    }
  }

  editDetails() {
    this.employeeForm.enable();
    this.toEdit = true;
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

  cancelAction(){
    this.cookieService.set('currentPage', 'People');
  }
}
