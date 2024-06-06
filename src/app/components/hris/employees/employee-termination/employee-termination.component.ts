import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { terminationOptions } from 'src/app/models/hris/constants/terminationOptions.constants';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeTerminationService } from 'src/app/services/hris/employee/employee-termination.service';

@Component({
  selector: 'app-employee-termination',
  templateUrl: './employee-termination.component.html',
  styleUrls: ['./employee-termination.component.css']
})
export class EmployeeTerminationComponent implements OnInit {

  @Input() employeeProfile!: EmployeeProfile;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  newterminationform: FormGroup;
  terminationOption: string[] = terminationOptions.map((termination) => termination.value);
  selectedFile!: File;
  screenWidth = window.innerWidth;

  isMobileScreen: boolean = false;
  fileUploaded: boolean = false;
  interviewFileUploaded: boolean = false;
  isvalidFile: boolean = false;
  isvalidFileSize: boolean = false;
  checkboxesValid: boolean = true;
  formSubmitted: boolean = false;

  terminationOptionValue: number = 0;
  interviewDocFilename: string = "";
  base64String: string = "";
  employeeId = this.route.snapshot.params['id'];

  constructor(
    private navService: NavService,
    private fb: FormBuilder,
    private router: Router,
    private snackBarService: SnackbarService,
    public employeeService: EmployeeService,
    private employeeTerminationService: EmployeeTerminationService,
    private route: ActivatedRoute,
  ) {
    this.newterminationform = this.fb.group({
      terminationOption: new FormControl('', Validators.required),
    dayOfNotice: new FormControl<Date | string>(new Date(Date.now()), Validators.required),
    lastDayOfEmployment: new FormControl<Date | string>(new Date(Date.now()), Validators.required),
    reEmploymentStatus: new FormControl<boolean>(false, Validators.required),
    equipmentStatus: new FormControl<boolean>(false, Validators.required),
    accountsStatus: new FormControl<boolean>(false, Validators.required),
    terminationDocument: new FormControl<string>('', Validators.required),
    terminationComments: new FormControl<string>(''),
  });
  }

  ngOnInit() {
    this.initializeForm();
    this.navService.hideNav();
  }

  ngOnDestroy() {
    this.navService.showNav();
  }

  initializeForm() {
    this.newterminationform = this.fb.group({
      terminationOption: new FormControl('', Validators.required),
      dayOfNotice: new FormControl<Date | string>('', Validators.required),
      lastDayOfEmployment: new FormControl<Date | string>('', Validators.required),
      reEmploymentStatus: new FormControl<boolean>(false, Validators.required),
      equipmentStatus: new FormControl<boolean>(false, Validators.required),
      accountsStatus: new FormControl<boolean>(false, Validators.required),
      terminationDocument: new FormControl<string>('', Validators.required),
      terminationComments: new FormControl<string>(''),
    });
    this.newterminationform.valueChanges.subscribe(() => {
      this.checkCheckboxesValid();
    });
    this.checkCheckboxesValid();
  }

  SaveEmployeeTermination(nextPage: string) {
    this.formSubmitted = true;
    this.checkCheckboxesValid();
    if (!this.checkboxesValid) {
      return;
    }

    const newterminationform = this.newterminationform.value;
    const employeeTerminationDto = {
      id: 0,
      employeeId: +this.employeeId,
      terminationOption: this.terminationOptionValue,
      dayOfNotice: newterminationform.dayOfNotice,
      lastDayOfEmployment: newterminationform.lastDayOfEmployment,
      reemploymentStatus: newterminationform.reEmploymentStatus,
      equipmentStatus: newterminationform.equipmentStatus,
      accountsStatus: newterminationform.accountsStatus,
      terminationDocument: this.base64String,
      documentName: newterminationform.terminationDocument,
      terminationComments: newterminationform.terminationComments
    };
    this.employeeTerminationService.saveEmployeeTermination(employeeTerminationDto).subscribe({
      next: () => this.snackBarService.showSnackbar("Employee termination saved", "snack-success"),
      error: () => this.snackBarService.showSnackbar("error", "Could not save termination"),
      complete: () => {
        this.router.navigateByUrl(nextPage);
      }
    });
  }

  removeDocument() {
    this.interviewDocFilename = '';
    const uploadedDoc = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadedDoc) {
      uploadedDoc.value = '';
    }
    this.snackBarService.showSnackbar('File removed successfully', 'snack-success');
  }

  onCVFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.interviewFileUploaded = true;
      const file = event.target.files[0];
      this.interviewDocFilename = file.name;
      if (this.validateFile(file)) {
        this.fileConverter(file, 'exitInterviewDoc');
      }
    }
  }

  fileConverter(file: File, controlName: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const base64Data = reader.result as string;
      this.newterminationform.patchValue({ [controlName]: base64Data });
      this.snackBarService.showSnackbar('File uploaded successfully', 'snack-success');
      this.base64String = base64Data;
    });
    reader.readAsDataURL(file);
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.isvalidFile = false;
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.isvalidFileSize = false;
      return false;
    }
    this.isvalidFileSize = true;
    return true;
  }

  goToPreviousPage() {
    this.router.navigateByUrl('/profile');
    this.navService.showNav();
  }

  setTerminationOption(option: number) {
    this.newterminationform.controls['terminationOption'].setValue(option);
    this.terminationOptionValue = option;
  }

  checkCheckboxesValid() {
    const equipmentStatusChecked = this.newterminationform.get('equipmentStatus')?.value;
    const accountsStatusChecked = this.newterminationform.get('accountsStatus')?.value;

    this.checkboxesValid = equipmentStatusChecked && accountsStatusChecked;
  }
}
