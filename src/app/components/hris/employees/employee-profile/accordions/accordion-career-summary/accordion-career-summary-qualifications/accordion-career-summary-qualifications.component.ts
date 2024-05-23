import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';


@Component({
  selector: 'app-career-summary-qualifications',
  templateUrl: './accordion-career-summary-qualifications.component.html',
  styleUrls: ['./accordion-career-summary-qualifications.component.css']
})

export class CareerSummaryQualificationsComponent {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
 
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private employeeQualificationsService : EmployeeQualificationsService,
    public navservice: NavService
  ) {
  }

  usingProfile: boolean = true;
  isValidFile: boolean = false;
  isValidFileSize: boolean = false;
  fileUploaded: boolean = false;

  fileName: string = '';
  filePreview: string | ArrayBuffer | null = null;
  base64File: string = "";
  fileUrl: string = '';
  proofOfQualificationFinal: string = '';
  isDisabledUpload: boolean = true;
  isDisabledDownload: boolean = true;

  ngOnInit() {
    this.usingProfile = this.employeeProfile!.simpleEmployee == undefined;
    this.fetchQualificationsById();
  }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  initializeForm() {
    this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
      highestQualification: [this.sharedAccordionFunctionality.employeeQualificationDto.highestQualification, Validators.required],
      school: [this.sharedAccordionFunctionality.employeeQualificationDto.school, Validators.required],
      fieldOfStudy: [this.sharedAccordionFunctionality.employeeQualificationDto.fieldOfStudy, Validators.required],
      year: [this.sharedAccordionFunctionality.employeeQualificationDto.year, [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      proofOfQualification: [this.sharedAccordionFunctionality.employeeQualificationDto.proofOfQualification],
    });
    this.sharedAccordionFunctionality.editQualifications = false;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.checkQualificationsFormProgress();
    this.sharedAccordionFunctionality.totalProfileProgress();
    this.fileName = this.sharedAccordionFunctionality.employeeQualificationDto.documentName!;
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true)
  }  
  
  editQualificationsDetails() {
    this.sharedAccordionFunctionality.editQualifications = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.isDisabledUpload = false;
    this.isDisabledDownload = false;
  }

  fetchQualificationsById() {
    var employeeId = this.navservice.employeeProfile.id!;
    this.employeeQualificationsService.getEmployeeQualificationById(employeeId).subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeeQualificationDto.id = data.id;
        this.sharedAccordionFunctionality.employeeQualificationDto.employeeId = data.employeeId;
        this.sharedAccordionFunctionality.employeeQualificationDto.highestQualification = data.highestQualification;
        this.sharedAccordionFunctionality.employeeQualificationDto.school = data.school;
        this.sharedAccordionFunctionality.employeeQualificationDto.fieldOfStudy = data.fieldOfStudy;
        this.sharedAccordionFunctionality.employeeQualificationDto.proofOfQualification = data.proofOfQualification;
        this.sharedAccordionFunctionality.employeeQualificationDto.documentName = data.documentName;
        this.proofOfQualificationFinal = data.proofOfQualification
        console.log(this.sharedAccordionFunctionality.employeeQualificationDto);
        if (data.year && data.year.endsWith("-01-01")) {
          this.sharedAccordionFunctionality.employeeQualificationDto.year = data.year.substring(0, 4);
        } else {
          this.sharedAccordionFunctionality.employeeQualificationDto.year = data.year;
        }
        this.sharedAccordionFunctionality.employeeQualificationDto.nqfLevel = data.nqfLevel;
        this.initializeForm();
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error.error, "snack-error");
      }
    })
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.fileUploaded = true;
      const file = event.target.files[0];
      this.fileName = file.name;
      this.sharedAccordionFunctionality.employeeQualificationDto.documentName = file.name;
      if (this.validateFile(file)) {
        this.fileConverter(file, 'proofOfQualification');
      }
    }
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.isValidFile = false;
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.isValidFileSize = false;
      return false;
    }
    this.isValidFileSize = true;
    return true;
  }

  fileConverter(file: File, controlName: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const base64Data = reader.result as string;
      this.sharedAccordionFunctionality.employeeQualificationForm.patchValue({ [controlName]: base64Data });
      this.proofOfQualificationFinal = base64Data;
    });
    reader.readAsDataURL(file);
  }

  downloadFile(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');
    if (commaIndex !== -1) {
      base64String = base64String.slice(commaIndex + 1);
    }
    const byteString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  saveQualificationsEdit() {
    if (this.sharedAccordionFunctionality.employeeQualificationForm.valid) {
      const existingQualificationId = this.sharedAccordionFunctionality.employeeQualificationDto.id;
  
      const updatedQualification: EmployeeQualifications = {
        id: existingQualificationId || 0,
        employeeId: this.navservice.employeeProfile.id || this.employeeProfile.employeeDetails.id,
        highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
        fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
        year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value + "-01-01",
        nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        proofOfQualification: this.proofOfQualificationFinal,
        documentName : this.fileName,
      };
  
      const qualificationObservable = existingQualificationId
        ? this.employeeQualificationsService.updateEmployeeQualification(updatedQualification, existingQualificationId)
        : this.employeeQualificationsService.saveEmployeeQualification(updatedQualification);
  
      qualificationObservable.subscribe({
        next: () => {
          this.fetchQualificationsById(); 
          this.snackBarService.showSnackbar(
            existingQualificationId ? "Qualifications updated" : "Qualifications saved",
            "snack-success"
          );
        },
        error: (error) => {
          this.fetchQualificationsById();
          this.snackBarService.showSnackbar(error.error, "snack-error");
        },
      });
    } else {
      this.snackBarService.showSnackbar("Please fill in the required fields", "snack-error");
    }
  }

  cancelQualificationsEdit(){
    this.sharedAccordionFunctionality.editQualifications = false;
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.personalDetailsForm.get(fieldName);

      if (control) {
        switch (this.sharedPropertyAccessService.checkPermission(table, fieldName)) {
          case PropertyAccessLevel.none:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = false;
            break;
          case PropertyAccessLevel.read:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          case PropertyAccessLevel.write:
            if (!initialLoad)
              control.enable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          default:
            if (!initialLoad)
              control.enable();
        }
      }
    });
  }
}