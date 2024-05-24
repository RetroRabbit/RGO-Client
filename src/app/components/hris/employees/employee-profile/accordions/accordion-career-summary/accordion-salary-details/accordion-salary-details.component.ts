import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeSalary } from 'src/app/models/hris/employee-salary.interface';
import { EmployeeSalaryService } from 'src/app/services/hris/employee/employee-salary.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';

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

  salaryDetailsForm: FormGroup = this.fb.group({
    remuneration: [{ value: '', disable: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
  });

  constructor(
    private fb: FormBuilder,
    private employeeSalaryService: EmployeeSalaryService,
    private snackBarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.getEmployeeSalaryDetails();
    this.initializeSalaryDetailsForm(this.employeeSalary);
  }

  initializeSalaryDetailsForm(salaryDetails: EmployeeSalary) {
    this.salaryDetailsForm = this.fb.group({
      remuneration: [{ value: salaryDetails.remuneration, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    });
  }

  getEmployeeSalaryDetails() {
    this.employeeSalaryService.getEmployeeSalary(this.employeeProfile.id as number).subscribe({
      next: data => {
        this.employeeSalary = data;
        this.getDate();
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
    if (this.salaryDetailsForm.valid) {
      this.editSalary = false;
      const salaryDetailsFormValue = this.salaryDetailsForm.value;
      this.employeeSalaryDetailsDto = {
        employeeId: this.employeeProfile.id,
        id: this.employeeSalary.id,
        salary: this.employeeSalary.salary,
        minSalary: this.employeeSalary.minSalary,
        maxSalary: this.employeeSalary.maxSalary,
        remuneration: salaryDetailsFormValue.remuneration,
        band: this.employeeSalary.band,
        contribution: this.employeeSalary.contribution,
        salaryUpdateDate: this.employeeSalary.salaryUpdateDate
      }
      this.employeeSalaryService.updateEmployeeSalary(this.employeeSalaryDetailsDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Salary details updated", "snack-success");
          this.editSalary = false;
          this.salaryDetailsForm.disable();
          this.getDate();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
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