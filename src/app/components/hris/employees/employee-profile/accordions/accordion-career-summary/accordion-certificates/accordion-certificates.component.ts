import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
import { EmployeeCertificatesService } from 'src/app/services/hris/employee/employee-certificate.service';
import { error } from 'console';
import { forkJoin } from 'rxjs';

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
  addingCertificate: boolean = false;
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
  base64String: string = "";

  copyOfCertificates: EmployeeCertificates[] = [];
  newCertificates: EmployeeCertificates[] = [];

  certificateForm: FormGroup = this.fb.group({
    CertificateName: [{ value: '', disabled: true }, Validators.required],
    IssueOrganization: [{ value: '', disabled: true }, Validators.required],
    IssueDate: [{ value: '', disabled: true }, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private employeeCertificateService: EmployeeCertificatesService
  ) { }

  ngOnInit(): void {
    this.getEmployeeCertificate();
  }

  getEmployeeCertificate() {
    this.employeeCertificateService.getCertificationDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.employeeCertificates = data;
        console.log(this.employeeCertificates);
        if (this.employeeCertificates && this.employeeCertificates.length > 0) {  // come back
          this.certificateId = this.employeeCertificates[this.employeeCertificates.length - 1].id; // come back 
        }
      },
      error: (error) => {
        console.error('Error fetching details', error)
      }
    })
  }

  findDifferenceInArrays(): EmployeeCertificates[] {
    let differenceArray: EmployeeCertificates[] = [];

    for (let i = 0; i < this.employeeCertificates.length; i++) {
      if (this.employeeCertificates[i].certificateName != this.copyOfCertificates[i].certificateName)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.employeeCertificates[i].issueOrganization != this.copyOfCertificates[i].issueOrganization)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.employeeCertificates[i].issueDate != this.copyOfCertificates[i].issueDate)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.employeeCertificates[i].certificateDocument != this.copyOfCertificates[i].certificateDocument)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.employeeCertificates[i].documentName != this.copyOfCertificates[i].documentName)
        differenceArray.push(this.copyOfCertificates[i]);
    }
    return differenceArray
  }

  saveCertificateDetails() {
    this.isUpdated = true;
    const total = this.newCertificates.length;
    let saveCount = 0;
    let errorOccurred = false;

    this.newCertificates.forEach(newCertificate => {
      this.employeeCertificateService.saveCertification(newCertificate).subscribe({
        next: () => {
          saveCount++;
          if (saveCount === total && !errorOccurred) {
            this.snackBarService.showSnackbar("Certificate info updated", "snack-success");
            this.hasUpdatedCertificateData = true;
            this.addingCertificate = false;
            this.newCertificates = [];
            this.getEmployeeCertificate();
          }
        },
        error: (error) => {
          errorOccurred = true;
          this.snackBarService.showSnackbar("Unable to update all fields", "snack-error");
          this.addingCertificate = false;
          this.editCertificate = false;
        }
      });
    });
  }

  updateCertificateDetails() {
    this.isUpdated = true;
    this.editCertificate = false; // Reset the edit flag early
    const editedCertificatesArray = this.findDifferenceInArrays();

    const updateObservables = editedCertificatesArray.map(certificate =>
      this.employeeCertificateService.updateCertification(certificate)
    );
    forkJoin(updateObservables).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Certificate info updated", "snack-success");
        this.hasUpdatedCertificateData = true;
        this.getEmployeeCertificate();
      },
      error: () => {
        this.snackBarService.showSnackbar("Unable to update all fields", "snack-error");
      }
    });
  }


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

  fileConverter(file: File, index: number, newOrUpdate: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.base64String = reader.result as string;
      if (newOrUpdate == 'update') {
        this.copyOfCertificates[index].certificateDocument = this.base64String;
        this.copyOfCertificates[index].documentName = file.name;
      }
      else if (newOrUpdate == 'new') {
        this.newCertificates[index].certificateDocument = this.base64String;
        this.newCertificates[index].documentName = file.name;
      }
    });
    reader.readAsDataURL(file);
  }

  editCertificateDetails() {
    this.editCertificate = true;
    this.certificateForm.enable();
    this.copyOfCertificates = [];
    this.copyEmployeeCertificates();
  }

  cancelCertificateDetails() {
    this.editCertificate = false;
    this.addingCertificate = false;
    this.certificateForm.disable();
    this.copyOfCertificates = this.employeeCertificates;
  }

  copyEmployeeCertificates() {
    this.employeeCertificates.forEach(certificate => {
      const copiedCert = JSON.parse(JSON.stringify(certificate));
      this.copyOfCertificates.push(copiedCert);
    });
    console.log(this.copyOfCertificates);
  }

  addNewCertificate() {
    this.addingCertificate = true;
    const newCertificate: EmployeeCertificates = {
      id: 0,
      issueDate: new Date,
      issueOrganization: '',
      certificateName: '',
      certificateDocument: this.base64String,
      documentName: '',
      employeeId: this.employeeProfile.id as number
    }
    this.newCertificates.push(newCertificate);
  }

  removeNewCertificate(index: number) {
    this.addingCertificate = false;
    this.newCertificates.splice(index, 1);
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

  onFileChange(event: any, index: number, newOrUpdate: string): void {
    if (event.target.files && event.target.files.length) {
      this.fileUploaded = true;
      const file = event.target.files[0];
      this.fileConverter(file, index, newOrUpdate);
    }
  }
}