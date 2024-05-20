import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { Certificate } from 'crypto';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
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
  editCertificate: boolean = false;
  isUpdated: boolean = false;
  selectedFile !: File;
  certificatePDFName: String = "";

  certificateFrom: FormGroup = this.fb.group({
    CertificateName: [{ value: '', disabled: true }, Validators.required],
    IssueOrganization: [{ value: '', disabled: true }, Validators.required],
    IssueDate: [{ value: '', disabled: true }, Validators.required],
    CertificateDocument: [{ value: '', disabled: true }, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService
  ){}

  initializeCertificatesForm(certificatesForm: EmployeeCertificates){
    if(certificatesForm == null){
      this.hasCertificateData = false;
      return;
    }
    this.certificateFrom = this.fb.group({

      Certificatename: [{ value: certificatesForm.CertficateName, disabled: true }, Validators.required],
      IssueOrganization: [{ value: certificatesForm.IssueOrganization, disabled: true }, Validators.required],
      IssueDate: [{ value: certificatesForm.IssueDate, disabled: true }, Validators.required],
      CertificateDocument: [{ value: certificatesForm.CertificateDocument, disabled: true }, Validators.required],
    });
    // this.hasFile = certificatesForm.file.length > 0;
    this.hasCertificateData = true;
  }

  downloadCertificate(){ }

  editCertificateDetails(){
    this.editCertificate = true;
    this.certificateFrom.enable();
  }

  cancelCertificateDetails(){
    this.editCertificate = true;
    this.certificateFrom.disable();
  }

  saveCertificateDetails(){}

  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.certificateFrom.patchValue({ 'file': base64String });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.certificatePDFName = this.selectedFile.name;
    this.uploadFile();
  }

  openFileInput(){
    const fileInput = document.getElementById('fileupload') as HTMLInputElement;
    fileInput.click();
  }
}
