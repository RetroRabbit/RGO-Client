import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
import { EmployeeCertificatesService } from 'src/app/services/hris/employee/employee-certificate.service';
import { forkJoin } from 'rxjs';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';

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
  certificateInformationProgress: number = 0;
  certificateId: number = 0;
  editCertificate: boolean = false;
  addingCertificate: boolean = false;
  isUpdated: boolean = false;
  showConfirmDialog: boolean = false;
  selectedFile !: File;
  certificatePDFName: String = "";
  certificateFileName: string = "";
  employeeCertitificateDto !: EmployeeCertificates;
  fileUploaded: boolean = false;
  isValidCertificateFileSize = true;
  hasUpdatedCertificateData: boolean = false;
  isValidCertificateFile = true;
  base64String: string = "";
  removeNewOrUpdate: string = '';
  removeIndex: number = 0;
  newCertificateIndex: number | null = null;

  copyOfCertificates: EmployeeCertificates[] = [];
  newCertificates: EmployeeCertificates[] = [];

  dialogTypeData: Dialog = {
    type: 'confirm',
    title: 'Delete Certificate',
    subtitle: 'Are You Sure You Want to Delete?',
    confirmButtonText: 'Delete',
    denyButtonText: "Cancel"
  };

  constructor(
    private snackBarService: SnackbarService,
    private employeeCertificateService: EmployeeCertificatesService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,

  ) { }

  ngOnInit(): void {
    this.getEmployeeCertificate();
  }

  getEmployeeCertificate() {
    this.employeeCertificateService.getCertificationDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeeCertificates = data;
        this.sharedAccordionFunctionality.employeeCertificatesFields = this.sharedAccordionFunctionality.employeeCertificatesFields * this.sharedAccordionFunctionality.employeeCertificates.length;
      },
      error: (er) => this.snackBarService.showError(er),
    });
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

  findDifferenceInArrays(): EmployeeCertificates[] {
    let differenceArray: EmployeeCertificates[] = [];

    for (let i = 0; i < this.sharedAccordionFunctionality.employeeCertificates.length; i++) {
      if (this.sharedAccordionFunctionality.employeeCertificates[i].certificateName != this.copyOfCertificates[i].certificateName)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.sharedAccordionFunctionality.employeeCertificates[i].issueOrganization != this.copyOfCertificates[i].issueOrganization)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.sharedAccordionFunctionality.employeeCertificates[i].issueDate != this.copyOfCertificates[i].issueDate)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.sharedAccordionFunctionality.employeeCertificates[i].certificateDocument != this.copyOfCertificates[i].certificateDocument)
        differenceArray.push(this.copyOfCertificates[i]);
      else if (this.sharedAccordionFunctionality.employeeCertificates[i].documentName != this.copyOfCertificates[i].documentName)
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
            this.snackBarService.showSnackbar("Saved", "snack-success");
            this.hasUpdatedCertificateData = true;
            this.addingCertificate = false;
            this.newCertificates = [];
            this.getEmployeeCertificate();
          }
        },
        error: (er) => {
          errorOccurred = true;
          this.snackBarService.showError(er);
          this.addingCertificate = false;
          this.editCertificate = false;
        }
      });
    });
  }

  updateCertificateDetails() {
    this.isUpdated = true;
    this.editCertificate = false;
    const editedCertificatesArray = this.findDifferenceInArrays();
    const updateObservables = editedCertificatesArray.map(certificate =>
      this.employeeCertificateService.updateCertification(certificate)
    );
    forkJoin(updateObservables).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Updated", "snack-success");
        this.hasUpdatedCertificateData = true;
        this.getEmployeeCertificate();
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
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

  editCertificateDetails() {
    this.editCertificate = true;
    this.copyOfCertificates = [];
    this.copyEmployeeCertificates();
  }

  cancelCertificateDetails() {
    this.editCertificate = false;
    this.addingCertificate = false;
    this.copyOfCertificates = this.sharedAccordionFunctionality.employeeCertificates;
    if (this.newCertificateIndex !== null) {
      this.newCertificates.splice(this.newCertificateIndex, 1);
      this.newCertificateIndex = null;
    }
    this.newCertificates = [];
  }

  copyEmployeeCertificates() {
    this.sharedAccordionFunctionality.employeeCertificates.forEach(certificate => {
      const copiedCert = JSON.parse(JSON.stringify(certificate));
      this.copyOfCertificates.push(copiedCert);
    });
  }

  showDialog(newOrUpdate: string, index: number) {
    this.removeNewOrUpdate = newOrUpdate;
    this.removeIndex = index;
    this.showConfirmDialog = true;
  }

  dialogFeedBack(confirmation: boolean) {
    this.showConfirmDialog = false;
    if (confirmation) {
      if (this.removeNewOrUpdate == 'update') {
        this.removeExistingCertficate(this.removeIndex);
      }
      else {
        this.removeNewCertificate(this.removeIndex);
      }
    }
  }

  removeNewCertificate(index: number) {
    this.newCertificates.splice(index, 1);
  }

  removeExistingCertficate(index: number) {
    const certificateId = this.copyOfCertificates[index].id;
    this.employeeCertificateService.deleteCertificate(certificateId).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Deleted", "snack-success");
        this.copyOfCertificates.splice(index, 1);
        this.sharedAccordionFunctionality.employeeCertificates.splice(index, 1);
        this.sharedAccordionFunctionality.employeeCertificatesFields = this.sharedAccordionFunctionality.employeeCertificatesFields - 4;
        this.editCertificate = false;
      },
      error: (er) => this.snackBarService.showError(er),
    });
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
      this.certificateFileName = file.name;
    }
  }

  fileConverter(file: File, index: number, newOrUpdate: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.base64String = reader.result as string;
      if (newOrUpdate == 'update') {
        this.copyOfCertificates[index].certificateDocument = this.base64String;
        this.copyOfCertificates[index].documentName = file.name;
        this.snackBarService.showSnackbar("Updated", "snack-success");
      }
      else if (newOrUpdate == 'new') {
        this.newCertificates[index].certificateDocument = this.base64String;
        this.newCertificates[index].documentName = file.name;
        this.snackBarService.showSnackbar("Saved", "snack-success");
      }
    });
    reader.readAsDataURL(file);
  }

  currentDate: Date = new Date();

  disableFutureDates = (selectedDate: Date | null): boolean => {
    const date = (selectedDate || new Date());
    return date <= this.currentDate;
  }
}