import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { Certificate } from 'crypto';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
import { EmployeeCertificatesService } from 'src/app/services/hris/employee/employee-certificate.service';
import { error } from 'console';
@Component({
  selector: 'app-accordion-certificates',
  templateUrl: './accordion-certificates.component.html',
  styleUrls: ['./accordion-certificates.component.css']
})
export class AccordionCertificatesComponent {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile !: EmployeeProfile | SimpleEmployee;

  shouldUseSentInProfile: boolean = true;
  panelOpenState: boolean = false;
  hasFile: boolean = false;
  hasCertificateData = false;
  employeeCertificates: EmployeeCertificates[] = [];
  certificateInformationProgress: number = 0;
  certificateId: number = 0;
  editCertificate: boolean = false;
  isUpdated: boolean = false;
  selectedFile !: File;
  certificatePDFName: String = "";
  certificateFilename: string = "";
  certificateFileName = "";
  employeeCertitificateDto !: EmployeeCertificates;
  fileUploaded: boolean = false;
  isValidCertificateFileSize = true;
  hasUpdatedCertificateData: boolean = false;
  isValidCertificateFile = true;
  base64File: string ="";
  base64String: string = "";

  certificateForm: FormGroup = this.fb.group({
    CertificateName: [{ value: '', disabled: true }, Validators.required],
    IssueOrganization: [{ value: '', disabled: true }, Validators.required],
    IssueDate: [{ value: '', disabled: true }, Validators.required],
    CertificateDocument: [{ value: '', disabled: true }, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private employeeCertificateService: EmployeeCertificatesService
  ) { }

  ngOnInit(): void {
    this.getEmployeeCertificate();
  }

  initializeCertificatesForm(certificatesForm: EmployeeCertificates) {
    if (certificatesForm == null) {
      this.hasCertificateData = false;
      return;
    }
    this.certificateForm = this.fb.group({
      CertificateName: [{ value: certificatesForm.certificateName, disabled: true }, Validators.required],
      IssueOrganization: [{ value: certificatesForm.issueOrganization, disabled: true }, Validators.required],
      IssueDate: [{ value: certificatesForm.issueDate, disabled: true }, Validators.required],
      CertificateDocument: [{ value: '', disabled: true }, Validators.required]
    });
    // this.hasFile = certificatesForm.file.length > 0;
    this.hasCertificateData = true;
  }

  getEmployeeCertificate() {
    this.employeeCertificateService.getCertificationDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.employeeCertificates = data;
        if (this.employeeCertificates != null) {
          this.certificateId = this.employeeCertificates[this.employeeCertificates.length - 1].id;
        }
        this.initializeCertificatesForm(this.employeeCertificates[this.employeeCertificates.length - 1])
      }
    })
  }

  saveCertificateDetails() {
    this.editCertificate = false;
    this.isUpdated = true;
    const employeeCertificateFormValue = this.certificateForm.value;
    this.employeeCertitificateDto = {
      id: this.certificateId,
      employeeId: this.employeeProfile?.id,
      certificateName: employeeCertificateFormValue.CertificateName,
      issueOrganization: employeeCertificateFormValue.IssueOrganization,
      issueDate: employeeCertificateFormValue.IssueDate,
      certificateDocument: this.base64File
    }
    console.log(this.employeeCertitificateDto)
    if (this.hasCertificateData) {
      this.employeeCertitificateDto.id = this.employeeCertitificateDto.id
      this.employeeCertificateService.updateCertification(this.employeeCertitificateDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Certificate info updated", "snack-success");
          this.getEmployeeCertificate();
          this.hasUpdatedCertificateData = true;
          this.editCertificate = false;
          this.certificateForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
    }else{
      console.log(this.employeeCertitificateDto)
      this.employeeCertificateService.saveCertification(this.employeeCertitificateDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Certificate info saved", "snack-success");
          this.getEmployeeCertificate();
          this.editCertificate = false;
          this.certificateForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
    }
  }

  downloadCertificate() { }

  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        this.certificateForm.patchValue({ 'file': this.base64String });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.certificatePDFName = this.selectedFile.name;
    this.uploadFile();
  }

  openFileInput() {
    const fileInput = document.getElementById('fileupload') as HTMLInputElement;
    fileInput.click();
  }

  onDocumentChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.fileUploaded = true;
      const file = event.target.files[0];
      this.certificateFileName = file.name;
      this.fileConverter(file, )
      if (this.validatePortfolioFile(file)) {
        this.fileConverter(file);
      }
    }
  }

  validatePortfolioFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (file.size > 10 * 1024 * 1024) {
      this.isValidCertificateFileSize = false;
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      this.isValidCertificateFile = false;
      return false;
    }
    this.isValidCertificateFileSize = true;
    return true;
  }

  
  fileConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.base64File = reader.result as string;
    });
    reader.readAsDataURL(file);
  }
  
  editCertificateDetails() {
    this.editCertificate = true;
    this.certificateForm.enable();
  }

  cancelCertificateDetails() {
    this.editCertificate = false;
    this.certificateForm.disable();
  }
}
