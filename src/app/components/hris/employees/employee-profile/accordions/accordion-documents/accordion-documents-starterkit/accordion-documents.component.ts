import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';

@Component({
  selector: 'app-accordion-documents-starterkit',
  templateUrl: './accordion-documents.component.html',
  styleUrls: ['./accordion-documents.component.css']
})
export class AccordionDocumentsComponent {
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  selectedEmployee!: EmployeeProfile;
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
  isLoadingUpload: boolean = false;
  allowedTypes = ['application/pdf'];

  constructor(
    private employeeDocumentService: EmployeeDocumentService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private cookieService: CookieService,
    private authAccessService: AuthAccessService,
    public navService: NavService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public employeeBankingandstarterkitService: EmployeeBankingandstarterkitService
  ) { }

  ngOnInit() {
    this.getEmployeeDocuments();
    this.sharedAccordionFunctionality.totalDocumentsProgress()
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
    this.isLoadingUpload = true;
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    if (this.allowedTypes.includes(this.selectedFile.type)) {
      this.uploadProfileDocument();
    } else {
      this.snackBarService.showSnackbar("Upload PDF Only", "snack-error");
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
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 0).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.starterKitDocuments = data;
          this.dataSource.data = this.sharedAccordionFunctionality.fileStarterKitCategories;
          this.sharedAccordionFunctionality.calculateStarterKitDocuments();
          this.sharedAccordionFunctionality.totalDocumentsProgress();
        },
        error: (er) => this.snackBarService.showError(er),
      })
    } else {
      this.employeeId = this.navService.employeeProfile.id;
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeId, 0).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.starterKitDocuments = data;
          this.dataSource.data = this.sharedAccordionFunctionality.fileStarterKitCategories;
          this.sharedAccordionFunctionality.calculateStarterKitDocuments();
          this.sharedAccordionFunctionality.totalDocumentsProgress();

        },
        error: (er) => this.snackBarService.showError(er),
      })
    }

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
      this.employeeDocumentService.saveEmployeeDocument(saveObj, 0).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Saved", "snack-success");
          this.getEmployeeDocuments();
          this.sharedAccordionFunctionality.calculateStarterKitDocuments();
          this.sharedAccordionFunctionality.totalDocumentsProgress();
          this.employeeBankingandstarterkitService.getAllBankingAndStarterkits();
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
        adminFileCategory: 0,
        blob: document.blob,
        uploadDate: document.uploadDate,
        reason: document.reason,
        status: 1,
        counterSign: false,
        documentType: 0,
        lastUpdatedDate: document.lastUpdatedDate
      }
      this.employeeDocumentService.updateEmployeeDocument(updatedDocument).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.getEmployeeDocuments();
          this.sharedAccordionFunctionality.calculateStarterKitDocuments();
          this.sharedAccordionFunctionality.totalDocumentsProgress();
          this.employeeBankingandstarterkitService.getAllBankingAndStarterkits();
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
          counterSign: false,
          documentType: 0,
          lastUpdatedDate: new Date()
        };
        this.uploadDocumentDto(newDto);
        this.sharedAccordionFunctionality.calculateStarterKitDocuments();
        this.sharedAccordionFunctionality.totalDocumentsProgress();

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  filterDocumentsByCategory(): EmployeeDocument | null {
    var object = this.sharedAccordionFunctionality.starterKitDocuments.filter(document => document.fileCategory == this.uploadButtonIndex);
    if (object == null) {
      return null;
    }
    return object[0];
  }

  getFileName(index: number): EmployeeDocument {
    var documentObject = this.sharedAccordionFunctionality.starterKitDocuments.find(document => document.fileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  downloadDocument(event: any) {
    const id = event.srcElement.parentElement.id;
    const documentObject = this.sharedAccordionFunctionality.starterKitDocuments.find(document => document.fileCategory == id) as any;
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
    const documentObject = this.sharedAccordionFunctionality.starterKitDocuments.find(document => document.fileCategory == index);
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
    const documentObject = this.sharedAccordionFunctionality.starterKitDocuments.find(document => document.fileCategory == index);

    if (documentObject == undefined)
      return false;
    else
    return true
  }
}
