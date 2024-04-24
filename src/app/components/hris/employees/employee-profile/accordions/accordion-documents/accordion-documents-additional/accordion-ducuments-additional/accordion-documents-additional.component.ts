import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { FileCategory } from 'src/app/models/hris/constants/documents.contants';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

@Component({
  selector: 'app-accordion-documents-additional',
  templateUrl: './accordion-documents-additional.component.html',
  styleUrls: ['./accordion-documents-additional.component.css']
})
export class AccordionDucumentsAdditionalComponent {
  @Output() updateDocument = new EventEmitter<number>();
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;
  i: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  selectedEmployee!: EmployeeProfile;
  fileCategories: FileCategory[] = [];
  documentFormProgress: number = 0;
  documentsProgress: number = 0;
  employeeDocuments: EmployeeDocument[] = [];
  documentsFileName: string = "";
  base64String: string = "";
  uploadButtonIndex: number = 0;
  employeeId = this.route.snapshot.params['id'];
  previousPage: string = '';
  PREVIOUS_PAGE = "previousPage";
  showBackButtons: boolean = true;
  dataSource = new MatTableDataSource<FileCategory>(this.fileCategories);
  selectedFile !: File;
  roles: string[] = [];
  isLoadingUpload: boolean = false;
  newCategoryName: string = "";
  documentId: number = 0;

  constructor(
    private employeeDocumentService: EmployeeDocumentService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,

    private cookieService: CookieService,
    private authAccessService: AuthAccessService
  ) { }

  ngOnInit() {
    this.getAdditionalDocuments();
    this.getAdditionalDocumentReferences();
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));
  }

  openFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.click();
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

  captureUploadIndex(documentId: number) {
    this.uploadButtonIndex = documentId;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-document`) as HTMLInputElement;
    inputField.click();
    this.documentId = documentId;
  }

  uploadDocument(event: any) {
    this.isLoadingUpload = true;
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    this.uploadAdditionalDocument();
  }

  uploadAdditionalDocument() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.buildDocumentDto();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getAdditionalDocuments() {
    this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 1).subscribe({
      next: data => {
        this.employeeDocuments = data;
        this.dataSource.data = this.fileCategories;
        this.getAdditionalDocumentReferences();
      },
      error: error => {
        this.snackBarService.showSnackbar(error, "snack-error");
      }
    })
  }

  uploadDocumentDto(document: any) {
    const saveObj = {
      id: document.id,
      employeeId: document.employee.id,
      fileName: document.fileName,
      blob: this.base64String,
      fileCategory: document.fileCategory,
      uploadDate: document.uploadDate,
      status: 1,
      documentType: 0
    }
    if (document.id == 0) {
      this.employeeDocumentService.saveEmployeeDocument(saveObj, 1).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Document added", "snack-success");
          this.getAdditionalDocuments();
        },
        error: (error) => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar(error, "snack-error");

        }
      });
    } else {
      const updatedDocument = {
        id: document.id,
        employeeId: document.employee.id,
        reference: document.reference,
        fileName: document.fileName,
        fileCategory: document.fileCategory,
        blob: document.blob,
        uploadDate: document.uploadDate,
        reason: document.reason,
        status: 1,
        counterSign: false,
        documentType: 1
      }
      this.employeeDocumentService.updateEmployeeDocument(updatedDocument).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Document updated", "snack-success");
          this.getAdditionalDocuments();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
          this.isLoadingUpload = false;
        }
      });
    }
  }

  buildDocumentDto() {
    const existingValue = this.filterDocumentsById();
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        var newDto: {} = {
          id: existingValue != undefined ? existingValue?.id as number : 0,
          employee: this.employeeProfile,
          reference: existingValue?.reference,
          fileName: this.documentsFileName,
          fileCategory: +this.uploadButtonIndex,
          blob: this.base64String,
          status: 1,
          uploadDate: new Date(),
          reason: '',
          counterSign: false,
          documentType: 1
        };
        this.uploadDocumentDto(newDto);

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  filterDocumentsById(): EmployeeDocument | null {
    var object = this.employeeDocuments.filter(document => document.id == (this.uploadButtonIndex))[0];
    if (object == null) {
      return null;
    }
    return object;
  }

  getFileName(index: number): EmployeeDocument {
    var documentObject = this.employeeDocuments.find(document => document.fileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  downloadDocument(documentId: number) {
    const id = documentId;
    const documentObject = this.employeeDocuments.find(document => document.id == id) as any;
    this.downloadFile(documentObject?.blob as string, documentObject?.fileName as string);
  }

  disableUploadButton(index: number): boolean {
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == index);
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
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == index);

    if (documentObject == undefined)
      return false;

    if (documentObject?.status == 0 || documentObject?.status == 1)
      return false;
    return true;
  }

  addNewAdditionalCategory() {
    var newDto: {} = {
      id:0,
      employee: this.employeeProfile,
      reference: this.newCategoryName,
      fileName: this.documentsFileName,
      blob: this.base64String,
      status: 1,
      uploadDate: new Date(),
      reason: '',
      counterSign: false,
      documentType: 1
    };
    this.uploadNewAdditionalCategory(newDto)
  }

  uploadNewAdditionalCategory(document: any) {
    const saveObj = {
      id: document.id,
      employeeId: document.employee.id,
      reference: document.reference,
      fileName: document.fileName,
      blob: this.base64String,
      uploadDate: document.uploadDate,
      status: 1,
      documentType: 1
    }
    this.employeeDocumentService.saveEmployeeDocument(saveObj, 1).subscribe({
      next: () => {
        this.isLoadingUpload = false;
        this.snackBarService.showSnackbar("Document added", "snack-success");
        this.getAdditionalDocuments();
      },
      error: (error) => {
        this.isLoadingUpload = false;
        this.snackBarService.showSnackbar(error, "snack-error");
      }
    });
  }

  getAdditionalDocumentReferences() {
    const filteredDocuments = this.employeeDocuments.filter(document => document.reference !== "");
    this.fileCategories = filteredDocuments.map(document => ({
      name: document.reference, 
      id: document.id,
    }));
  }
}