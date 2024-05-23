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

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  panelOpenState: boolean = false;
  employeeSalary: EmployeeSalary[] = [];
  editSalary: boolean = false;

  salaryDetailsForm: FormGroup = this.fb.group({
    remuneration: [{ value: '', disable: true }, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private employeeSalaryService: EmployeeSalaryService,
    private snackBarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.salaryDetailsForm.disable();
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