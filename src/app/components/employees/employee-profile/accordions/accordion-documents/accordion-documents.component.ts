import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeDocument } from 'src/app/models/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/employee/employee-document.service';
import { Document } from 'src/app/models/constants/documents.contants';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from 'src/app/services/auth-access.service';
import { SimpleEmployee } from 'src/app/models/simple-employee-profile.interface';
@Component({
  selector: 'app-accordion-documents',
  templateUrl: './accordion-documents.component.html',
  styleUrls: ['./accordion-documents.component.css']
})
export class AccordionDocumentsComponent {
  @Output() updateDocument = new EventEmitter<number>();
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;
  
  @HostListener('window:resize',['$event'])
  onResize(){
    this.screenWidth = window.innerWidth;
  }

  selectedEmployee!: EmployeeProfile;
  fileCategories = Document;
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
  dataSource = new MatTableDataSource<string>();
  selectedFile !: File;
  roles: string[] = [];

  constructor(
    private employeeDocumentService: EmployeeDocumentService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private employeeRoleService: EmployeeRoleService,
    private employeeProfileService: EmployeeProfileService,
    private cookieService: CookieService,
    private authAccessService: AuthAccessService
  ) { }

  ngOnInit() {
    this.getEmployeeDocuments();
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

  captureUploadIndex(event: any) {
    this.uploadButtonIndex = event.srcElement.parentElement.id;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-document`) as HTMLInputElement;
    inputField.click();
  }

  uploadDocument(event: any) {
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    this.uploadProfileDocument();
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
    this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number).subscribe({
      next: data => {
        this.employeeDocuments = data;
        this.dataSource.data = this.fileCategories;
        this.calculateDocumentProgress();
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
      status: 1
    }
    if (document.id == 0) {
      this.employeeDocumentService.saveEmployeeDocument(saveObj).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Document added", "snack-success");
          this.getEmployeeDocuments();
          this.calculateDocumentProgress();
        },
        error: (error) => {
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
        counterSign: false
      }
      console.log(updatedDocument);
      this.employeeDocumentService.updateEmployeeDocument(updatedDocument).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Document updated", "snack-success");
          this.getEmployeeDocuments();
          this.calculateDocumentProgress();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
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
        var newDto: {} = {
          id: existingValue != undefined ? existingValue?.id as number : 0,
          employee: this.employeeProfile,
          reference: "",
          fileName: this.documentsFileName,
          fileCategory: +this.uploadButtonIndex,
          blob: this.base64String,
          status: 1,
          uploadDate: new Date(),
          reason: '',
          counterSign: false
        };
        this.uploadDocumentDto(newDto);

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  filterDocumentsByCategory(): EmployeeDocument | null {
    var object = this.employeeDocuments.filter(document => document.fileCategory == this.uploadButtonIndex);
    if (object == null) {
      return null;
    }
    return object[0];
  }

  getFileName(index: number): EmployeeDocument {
    var documentObject = this.employeeDocuments.find(document => document.fileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  downloadDocument(event: any) {
    const id = event.srcElement.parentElement.id;
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == id) as any;
    if (documentObject === undefined) {
      // TODO: download clean slate form
    }
    else {
      if (documentObject.status == 2) {
        // TODO: download clean slate form
      } else {
        this.downloadFile(documentObject?.blob as string, documentObject?.fileName as string);
      }
    }
  }

  disableUploadButton(index: number): boolean {
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == index);
    if (this.authAccessService.isEmployee()) {
      return false;
    }
    else if(documentObject == null && (this.authAccessService.isAdmin() ||  this.authAccessService.isSuperAdmin())){
      return false;
    }
    else if (documentObject?.status as number > 1) {
      if(this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()){
        return false;
      }
    }
    return true;
  }

  calculateDocumentProgress() {
    const total = this.fileCategories.length;
    const fetchedDocuments = this.employeeDocuments.filter(document => document.status == 0).length;
    this.documentFormProgress = fetchedDocuments / total * 100;
    this.updateDocument.emit(this.documentFormProgress);
  }

  disableDownload(index : number){
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == index);

    if(documentObject == undefined)
      return false;

    if(documentObject?.status == 0 || documentObject?.status == 1)
      return false;
    return true;
  }
}
