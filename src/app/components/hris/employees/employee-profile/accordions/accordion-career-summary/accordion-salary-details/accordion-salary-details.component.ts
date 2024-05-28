import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeSalary } from 'src/app/models/hris/employee-salary.interface';
import { EmployeeSalaryService } from 'src/app/services/hris/employee/employee-salary.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

@Component({
  selector: 'app-accordion-salary-details',
  templateUrl: './accordion-salary-details.component.html',
  styleUrls: ['./accordion-salary-details.component.css']
})
export class AccordionSalaryDetailsComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile!: EmployeeProfile | SimpleEmployee;

  panelOpenState: boolean = false;
  employeeSalaryDetailsDto!: any;
  employeeSalary: EmployeeSalary = {};
  editSalary: boolean = false;
  message: string = "";
  isAdminUser: boolean = false;

  salaryDetailsForm: FormGroup = this.fb.group({
    remuneration: [{ value: '', disable: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
  });

  constructor(
    private fb: FormBuilder,
    private employeeSalaryService: EmployeeSalaryService,
    private snackBarService: SnackbarService,
    private authAccessService: AuthAccessService) {
  }

  ngOnInit(): void {
    this.getEmployeeSalaryDetails();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.isAdminUser = true;
    }
  }

  initializeSalaryDetailsForm(salaryDetails: EmployeeSalary) {
    if (salaryDetails != null) {
      this.salaryDetailsForm = this.fb.group({
        remuneration: [salaryDetails.remuneration , [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      });
      this.getDate();
    }
    else {
      this.salaryDetailsForm = this.fb.group({
        remuneration: [ "", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      });
    }
    this.salaryDetailsForm.disable();
  }

  getEmployeeSalaryDetails() {
    this.employeeSalaryService.getEmployeeSalary(this.employeeProfile.id as number).subscribe({
      next: data => {
        this.employeeSalary = data;
        this.initializeSalaryDetailsForm(this.employeeSalary);
      },
      error: (error) => {
        this.snackBarService.showSnackbar("Error fetching salary details", "snack-error");
      }
    })
  }

  getDate() {
    let updateDate = this.employeeSalary.salaryUpdateDate;
    let day = new Date(updateDate as Date).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    let month = monthNames[new Date(updateDate as Date).getMonth()];
    let year = new Date(updateDate as Date).getFullYear();
    this.message = day + " " + month + " " + " " + year;
  }

  saveEmployeeSalaryDetails() {
    const salaryDetailsFormValue = this.salaryDetailsForm.value;
    if (this.salaryDetailsForm.valid) {
      this.editSalary = false;
      if (this.employeeSalary) {
        this.employeeSalaryDetailsDto = {
          employeeId: this.employeeSalary.id,
          id: this.employeeSalary.id,
          salary: this.employeeSalary.salary,
          minSalary: this.employeeSalary.minSalary,
          maxSalary: this.employeeSalary.maxSalary,
          remuneration: salaryDetailsFormValue.remuneration,
          band: this.employeeSalary.band,
          contribution: this.employeeSalary.contribution,
          salaryUpdateDate: new Date()
        }
        this.employeeSalaryService.updateEmployeeSalary(this.employeeSalaryDetailsDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Salary details has been updated", "snack-success");
            this.getDate();
            this.editSalary = false;
            this.salaryDetailsForm.disable();
          },
          error: (error) => {
            this.snackBarService.showSnackbar(error, "snack-error");
          }
        })
      } else {
        this.employeeSalaryDetailsDto = {
          employeeId: this.employeeProfile.id,
          id: 0,
          salary: 0,
          minSalary: 0,
          maxSalary: 0,
          remuneration: salaryDetailsFormValue.remuneration,
          band: 0,
          contribution: "",
          salaryUpdateDate: new Date()
        }
        this.employeeSalaryService.saveEmployeeSalary(this.employeeSalaryDetailsDto).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Salary details has been saved", "snack-success");
            this.getDate();
            this.editSalary = false;
            this.salaryDetailsForm.disable();
          },
          error: (error) => {
            this.snackBarService.showSnackbar(error, "snack-error");
          }
        })
      }
    }
    else if (salaryDetailsFormValue.remuneration < 0) {
      this.snackBarService.showSnackbar("Remuneration cannot be less than zero", "snack-error");
    }
    else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }

  }

  editSalaryDetails() {
    this.editSalary = true;
    this.salaryDetailsForm.enable();
  }

  cancelSalaryDetails() {
    this.editSalary = false;
    this.salaryDetailsForm.disable();
  }
}