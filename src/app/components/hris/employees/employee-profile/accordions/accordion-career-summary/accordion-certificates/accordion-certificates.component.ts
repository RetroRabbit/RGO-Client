import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
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
  base64File: string = "";
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
    // console.log(this.employeeProfile.id);
    this.getEmployeeCertificate();
    console.log(this.employeeProfile.id)
  }//its getting it as 15

  getEmployeeCertificate() {
    this.employeeCertificateService.getCertificationDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        // console.log(data);
        this.employeeCertificates = data;
        if (this.employeeCertificates && this.employeeCertificates.length > 0) {  // come back
          this.certificateId = this.employeeCertificates[this.employeeCertificates.length - 1].id; // come back 
          this.initializeCertificatesForm(this.employeeCertificates[this.employeeCertificates.length - 1])
        }
      },
      error: (error) => {
        console.error('Error fetching details', error)
      }
    })
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
    });
    this.hasCertificateData = true;
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
   // const editedCertificatesArray = this.findDifferenceInArrays();

    let saveCount = 0;
    const total = this.newCertificates.length;
    console.log(this.newCertificates);
    this.newCertificates.forEach(newCertificate => {
      this.employeeCertificateService.saveCertification(newCertificate).subscribe({
        next: () =>  { console.log(++saveCount)}
      });
    });
    console.log(`Save count: ${saveCount} vs Total save: ${total}`)
    if(saveCount == total){
      this.snackBarService.showSnackbar("Certificate info updated", "snack-success");
      this.hasUpdatedCertificateData = true;
    }
    else{
      this.snackBarService.showSnackbar("Unable to update all fields", "snack-error");
    }
    this.addingCertificate = false;
  }
  

  updateCertificateDetails() {
    this.isUpdated = true;
    const editedCertificatesArray = this.findDifferenceInArrays();

    let updateCount = 0;
    const totalUpdates = editedCertificatesArray.length;

    editedCertificatesArray.forEach(certificate => {
      this.employeeCertificateService.updateCertification(certificate).subscribe({
        next: () =>  updateCount++
      });
    });

    if(updateCount == totalUpdates){
      this.snackBarService.showSnackbar("Certificate info updated", "snack-success");
      this.hasUpdatedCertificateData = true;
    }
    else{
      this.snackBarService.showSnackbar("Unable to update all fields", "snack-error");
    }
   this.editCertificate = false;
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

  // onDocumentChange(event: any): void {
  //   if (event.target.files && event.target.files.length) {
  //     this.fileUploaded = true;
  //     const file = event.target.files[0];
  //     this.certificateFileName = file.name;
  //     this.fileConverter(file,)
  //     if (this.validatePortfolioFile(file)) {
  //       this.fileConverter(file);
  //     }
  //   }
  // }

  // validatePortfolioFile(file: File): boolean {
  //   const allowedTypes = ['application/pdf'];
  //   if (file.size > 10 * 1024 * 1024) {
  //     this.isValidCertificateFileSize = false;
  //     return false;
  //   }
  //   if (!allowedTypes.includes(file.type)) {
  //     this.isValidCertificateFile = false;
  //     return false;
  //   }
  //   this.isValidCertificateFileSize = true;
  //   return true;
  // }


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
    this.copyOfCertificates = [];
    this.copyEmployeeCertificates();
  }

  cancelCertificateDetails() {
    this.editCertificate = false;
    this.addingCertificate = false;
    this.certificateForm.disable();
    this.copyOfCertificates = this.employeeCertificates;
  }

  copyEmployeeCertificates() { // deep copy of array
    this.employeeCertificates.forEach(certificate => {
      const copiedCert = JSON.parse(JSON.stringify(certificate));
      this.copyOfCertificates.push(copiedCert);
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
      this.fileConverter(file);
      if (newOrUpdate == 'update') {
        this.copyOfCertificates[index].certificateDocument = this.base64File;
        this.copyOfCertificates[index].documentName = file.name;
      }
      else if (newOrUpdate == 'new') {
        this.newCertificates[index].certificateDocument = this.base64File;
        this.newCertificates[index].documentName = file.name;
      }
    }
  }
}