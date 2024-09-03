import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { FileProcessingService } from 'src/app/services/hris/file-processing.service';

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
    private employeeQualificationsService: EmployeeQualificationsService,
    public navservice: NavService,
    private fileProcessingService: FileProcessingService
  ) { }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile }

  isValidFile: boolean = false;
  isValidFileSize: boolean = false;
  fileUploaded: boolean = false;
  isDisabledUpload: boolean = true;
  isDisabledDownload: boolean = true;
  editQualifications: boolean = false;

  fileName: string = '';
  base64File: string = "";
  fileUrl: string = '';

  async ngOnInit() {
    await this.fetchQualificationsById();
  }

  async fetchQualificationsById() {
    this.employeeQualificationsService.getEmployeeQualificationById(this.employeeProfile.employeeDetails.id as number).subscribe({
      next: async (data) => {
        this.sharedAccordionFunctionality.employeeQualification = data;
        this.base64File = data.proofOfQualification;
        console.log('Fetched qualifications:', data);
        console.log('name of the fetched document', data.documentName);
        console.log('This is the db proofOfQualification: ', this.base64File);
        if (this.sharedAccordionFunctionality.employeeQualification) {
          if (data.year && data.year.endsWith("-01-01")) {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year.substring(0, 4);
          } else {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year;
          }
        }
        await this.initializeForm();
        this.sharedAccordionFunctionality.calculateQualificationProgress();
        this.sharedAccordionFunctionality.totalCareerProgress();
      },
    })
  }

  async initializeForm() {
    if (!this.sharedAccordionFunctionality.employeeQualification) {
      this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
        highestQualification: ["", Validators.required],
        school: ["", Validators.required],
        fieldOfStudy: ["", Validators.required],
        year: ["", [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
        proofOfQualification: [""],
      });
    } else {
      this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
        highestQualification: [this.sharedAccordionFunctionality.employeeQualification.highestQualification, Validators.required],
        school: [this.sharedAccordionFunctionality.employeeQualification.school, Validators.required],
        fieldOfStudy: [this.sharedAccordionFunctionality.employeeQualification.fieldOfStudy, Validators.required],
        year: [this.sharedAccordionFunctionality.employeeQualification.year, [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
        proofOfQualification: [this.sharedAccordionFunctionality.employeeQualification.proofOfQualification],
      });
    }
    this.editQualifications = false;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.calculateQualificationProgress();
    this.sharedAccordionFunctionality.totalCareerProgress();
    this.fileName = this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.documentName : '';
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualification", true , this.sharedAccordionFunctionality.employeeQualificationForm , this.employeeProfile.employeeDetails.email!)
  }

  saveQualificationsEdit() {
    if (this.sharedAccordionFunctionality.employeeQualificationForm.valid) {
        const saveQualification: EmployeeQualifications = {
            id: this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.id : 0,
            employeeId: this.employeeProfile.employeeDetails.id as number,
            highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
            school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
            fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
            year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value + "-01-01",
            nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
            proofOfQualification: this.fileProcessingService.compressFile(this.base64File),  // Ensure this is the latest base64 file
            documentName: this.fileName,
        };

        const updatedQualification: EmployeeQualifications = {
          id: this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.id : 0,
          employeeId: this.employeeProfile.employeeDetails.id as number,
          highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
          school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
          fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
          year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value + "-01-01",
          nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
          proofOfQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("proofOfQualification")?.value,
          documentName: this.fileName,
        };

        const qualificationObservable = saveQualification.id > 0
            ? this.employeeQualificationsService.updateEmployeeQualification(saveQualification, saveQualification.id)
            : this.employeeQualificationsService.saveEmployeeQualification(saveQualification);

        qualificationObservable.subscribe({
            next: () => {
                this.snackBarService.showSnackbar(saveQualification.id > 0 ? "Updated" : "Saved", "snack-success");
                this.fetchQualificationsById();  // Ensure data is refreshed after save
            },
            error: (er) => this.snackBarService.showError(er)
        });
    } else {
        this.snackBarService.showSnackbar("Please Fill in the Required Fields", "snack-error");
    }
  }

  async editQualificationsDetails() {
    this.editQualifications = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.isDisabledUpload = false;
    this.isDisabledDownload = false;
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualification", false , this.sharedAccordionFunctionality.employeeQualificationForm , this.employeeProfile.employeeDetails.email!)
  }

  cancelQualificationsEdit() {
    this.editQualifications = false;
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }

  // onFileChange(event: any): void {
  //   if (event.target.files && event.target.files.length) {
  //     this.fileUploaded = true;
  //     const file = event.target.files[0];
  //     this.fileName = file.name;
  //     if (this.fileProcessingService.validateFile(file)) {
  //       this.fileProcessingService.convertFileToBase64(file).then((base64File) => {
  //         console.log('onFileChange- File selected, base64:', base64File);
  //         this.base64File = base64File;
  //       });
  //     }
  //   }
  // }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
        this.fileUploaded = true;
        const file = event.target.files[0];
        this.fileName = file.name;
        if (this.fileProcessingService.validateFile(file)) {
            this.fileProcessingService.convertFileToBase64(file).then((base64File) => {
                console.log('onFileChange- File selected, base64:', base64File);
                this.base64File = base64File;
                this.isDisabledDownload = false; 
            }).catch((error) => {
                console.error('Error converting file to base64:', error);
            });
        }
    }
  }

  downloadFile() {
    console.log('downloadFile- Base64 file before decompression:', this.base64File);
    const decompressedFile = this.fileProcessingService.decompressFile(this.base64File);
    console.log('downloadFile- Decompressed file:', decompressedFile);
    this.fileProcessingService.downloadFile(decompressedFile, this.fileName);
  }
}