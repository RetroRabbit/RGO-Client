import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { DialogTypeData } from 'src/app/models/hris/dialog-type-data.model';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';

@Component({
  selector: 'app-accordion-administrative-documents',
  templateUrl: './accordion-administrative-documents.component.html',
  styleUrls: ['./accordion-administrative-documents.component.css']
})
export class AccordionAdministrativeDocumentsComponent {
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  documentsFileName: string = "";
  base64String: string = "";
  uploadButtonIndex: number = 0;
  employeeId = this.route.snapshot.params['id'];
  dataSource = new MatTableDataSource<string>();
  selectedFile !: File;
  roles: string[] = [];
  isLoadingUpload: boolean = false;
  allowedTypes = ['application/pdf', 'image/png', 'image/jpg'];
  showConfirmDialog: boolean = false;
  dialogTypeData!: Dialog;
  documentExists: boolean = false;

  constructor(
    private employeeDocumentService: EmployeeDocumentService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    public navService: NavService,
    private authAccessService: AuthAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
    this.dialogTypeData = new DialogTypeData().dialogTypeData;
  }

  ngOnInit() {
    this.roles = [this.authAccessService.getRole()];
    this.getEmployeeDocuments();
    this.sharedAccordionFunctionality.totalDocumentsProgress();
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
  
  captureUploadIndex(event: any) {
    this.uploadButtonIndex = event.srcElement.parentElement.id;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-administrative-document`) as HTMLInputElement;
    this.documentExists = this.filterDocumentsByCategory() != null;
    const existingDocument = this.filterDocumentsByCategory();
    this.showConfirmDialog = this.documentExists && existingDocument?.id !== 0;
    if (this.showConfirmDialog) {
      this.dialogTypeData.title = 'Replace Documents';
      this.dialogTypeData.subtitle = 'This action will replace the current document with this new document.';
      this.showDialog(0);
    } else {
      inputField.click();
    }
  }
  
  getAcceptedFileTypes(category: string): string {
    return category === 'Written Approval of Offer' ? '.pdf, .png, .jpg, .jpeg' : '.pdf';
  }

  uploadDocument(event: any, category: string) {
    this.isLoadingUpload = true;
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    
    const allowedTypes = this.getAcceptedFileTypes(category).split(', ').map(type => type.replace('.', ''));
    const fileType = this.selectedFile.type.split('/').pop()?.toLowerCase();
    
    if (fileType && allowedTypes.includes(fileType)) {
      this.uploadProfileDocument();
    } else {
      this.snackBarService.showSnackbar("Upload Correct File Type", "snack-error");
      this.isLoadingUpload = false;
    }
  }

  uploadProfileDocument() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.buildDocumentDto();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getEmployeeDocuments() {
    if (this.employeeId != undefined) {

      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 2).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.administrativeDocuments = data;
          this.dataSource.data = this.sharedAccordionFunctionality.fileAdminCategories;
          this.sharedAccordionFunctionality.calculateAdminDocumentProgress();
          this.sharedAccordionFunctionality.totalDocumentsProgress();
        },
        error: (er) => this.snackBarService.showError(er),
      });
    } else {
      this.employeeId = this.navService.employeeProfile.id;
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeId, 2).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.administrativeDocuments = data;
          this.dataSource.data = this.sharedAccordionFunctionality.fileAdminCategories;
          this.sharedAccordionFunctionality.calculateAdminDocumentProgress();
          this.sharedAccordionFunctionality.totalDocumentsProgress();

        },
        error: (er) => this.snackBarService.showError(er),
      });
    }
  }

  uploadDocumentDto(document: any) {
    const saveObj = {
      id: document.id,
      employeeId: document.employee.id,
      fileName: document.fileName,
      blob: this.base64String,
      fileCategory: 0,
      employeeFileCategory: 0,
      adminFileCategory: +this.uploadButtonIndex,
      uploadDate: document.uploadDate,
      status: 1,
      documentType: 2,
    }
    if (!document.id) {
      this.employeeDocumentService.saveEmployeeDocument(saveObj, 2).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Save", "snack-success");
          this.getEmployeeDocuments();
          this.sharedAccordionFunctionality.calculateAdminDocumentProgress();
          this.sharedAccordionFunctionality.totalDocumentsProgress();

        },
        error: (er) => {
          this.isLoadingUpload = false;
          this.snackBarService.showError(er);
        }
      });
    } else {
      const updatedDocument = {
        id: document.id,
        employeeId: document.employee.id,
        reference: document.reference,
        fileName: document.fileName,
        fileCategory: document.fileCategory,
        employeeFileCategory: 0,
        adminFileCategory: +this.uploadButtonIndex,
        blob: document.blob,
        uploadDate: document.uploadDate,
        reason: document.reason,
        status: 1,
        counterSign: false,
        documentType: 2,
        lastUpdatedDate: document.lastUpdatedDate,
      }
      this.employeeDocumentService.updateEmployeeDocument(updatedDocument).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.getEmployeeDocuments();
          this.sharedAccordionFunctionality.calculateAdminDocumentProgress();
          this.sharedAccordionFunctionality.totalDocumentsProgress();

        },
        error: (er) => {
          this.snackBarService.showError(er);
          this.isLoadingUpload = false;
        }
      });
    }
  }

  buildDocumentDto() {
    const existingValue = this.filterDocumentsByCategory();
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        let newDto: {} = {
          id: existingValue != undefined ? existingValue?.id as number : 0,
          employee: this.employeeProfile,
          reference: "",
          fileName: this.documentsFileName,
          fileCategory: 0,
          employeeFileCategory: 0,
          adminFileCategory: +this.uploadButtonIndex,
          blob: this.base64String,
          status: 1,
          documentType: 2,
          uploadDate: new Date(),
          reason: '',
          counterSign: false,
          lastUpdatedDate: new Date()
        };
        this.uploadDocumentDto(newDto);
        this.sharedAccordionFunctionality.calculateAdminDocumentProgress();
        this.sharedAccordionFunctionality.totalDocumentsProgress();

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  filterDocumentsByCategory(): EmployeeDocument | null {
    var object = this.sharedAccordionFunctionality.administrativeDocuments.filter(document => document.adminFileCategory == this.uploadButtonIndex);
    if (object == null) {
      return null;
    }
    return object[0];
  }

  getFileName(index: number): EmployeeDocument {
    var documentObject = this.sharedAccordionFunctionality.administrativeDocuments.find(document => document.adminFileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  downloadDocument(event: any) {
    const id = event.srcElement.parentElement.id;
    const documentObject = this.sharedAccordionFunctionality.administrativeDocuments.find(document => document.adminFileCategory == id) as any;
    this.downloadFile(documentObject?.blob as string, documentObject?.fileName as string);
  }

  disableUploadButton(index: number): boolean {
    const documentObject = this.sharedAccordionFunctionality.administrativeDocuments.find(document => document.adminFileCategory == index);
    if (this.authAccessService.isEmployee()) {
      return false;
    }
    else if (documentObject == null && (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin())) {
      return false;
    }
    else if (documentObject?.status as number > 1) {
      if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
        return false;
      }
    }
    return true;
  }

  disableDownload(index: number) {
    const documentObject = this.sharedAccordionFunctionality.administrativeDocuments.find(document => document.adminFileCategory == index);

    if (documentObject == undefined)
      return false;
    return true;
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.triggerInputField();
    }
  }

  showDialog(status: number) {
    this.dialogTypeData.type = 'confirm';
    this.dialogTypeData.confirmButtonText = 'Save';
    this.dialogTypeData.denyButtonText = 'Cancel';

    if (status === 0) {
      this.dialogTypeData.title = 'Replace Documents'
      this.dialogTypeData.subtitle = 'This action will replace the current document with this new document.';
    }
    this.showConfirmDialog = true;
  }

  triggerInputField() {
    const uploadField = document.getElementById(`${this.uploadButtonIndex}-administrative-document`) as HTMLInputElement;
    uploadField.click();
  }
}
