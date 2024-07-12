import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { MyDocumentTypes, FileCategory } from 'src/app/models/hris/constants/documents.contants';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, Validators } from '@angular/forms';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';

@Component({
  selector: 'app-accordion-my-documents',
  templateUrl: './accordion-my-documents.component.html',
  styleUrls: ['./accordion-my-documents.component.css']
})
export class AccordionDocumentsAdditionalComponent {
  @Input() employeeProfile!: EmployeeProfile;

  documentNameControl = new FormControl('', [
    Validators.required, Validators.minLength(5)
  ]);

  documentTypeControl = new FormControl('', [
    Validators.required,]);

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  isLoadingDocument: boolean = false;
  fileCategories: FileCategory[] = [];
  base64String: string = "";
  employeeId = this.route.snapshot.params['id'];
  previousPage: string = '';
  PREVIOUS_PAGE = "previousPage";
  showBackButtons: boolean = true;
  dataSource = new MatTableDataSource<FileCategory>(this.fileCategories);
  selectedFile !: File;
  roles: string[] = [];
  isLoadingUpload: boolean = false;
  documentId: number = 0;
  documentTypes = MyDocumentTypes;
  newDocumentName: string = '';
  newDocumentType: string = '';
  otherSelected: boolean = false;


  constructor(
    private employeeDocumentService: EmployeeDocumentService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private cookieService: CookieService,
    public navService: NavService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) { }

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));
    this.getAdditionalDocuments();
  }

  onChangeDocumentTypes() {
    if (this.newDocumentType == "Other") {
      this.otherSelected = true;
    } else {
      this.otherSelected = false;
    }
  }

  addNewAdditionalDocument() {
    if (this.newDocumentType == "Other") {
      if (this.newDocumentName == "") {
        this.snackBarService.showSnackbar("Title Missing", "snack-error")
        return;
      }
      if (this.newDocumentName.length <= 4) {
        this.snackBarService.showSnackbar("Longer Title Required", "snack-error")
        return;
      }
      const inputField = document.getElementById('upload-new-additional-document');
      inputField?.click();
    }
    else {
      this.documentNameControl.clearValidators;
      this.newDocumentName = this.newDocumentType;
      if (this.newDocumentName == "") {
        this.snackBarService.showSnackbar("Title Missing", "snack-error")
        return;
      }
      const inputField = document.getElementById('upload-new-additional-document');
      inputField?.click();
    }
  }

  captureNewDocument(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        var newDto: {} = {
          id: 0,
          employeeId: this.employeeProfile.id,
          reference: this.newDocumentName,
          fileName: this.selectedFile.name,
          fileCategory: 0,
          blob: this.base64String,
          status: 1,
          uploadDate: new Date(),
          documentType: 1
        };
        this.uploadDocumentDto(newDto);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadDocumentDto(document: any) {
    this.employeeDocumentService.saveEmployeeDocument(document, 1).subscribe({
      next: () => {
        this.isLoadingUpload = false;
        this.snackBarService.showSnackbar("Saved", "snack-success");
        this.getAdditionalDocuments();
      },
      error: (er) => {
        this.isLoadingUpload = false;
        this.snackBarService.showError(er);

      }
    });
  }

  downloadDocument(documentId: number) {
    const documentObject = this.sharedAccordionFunctionality.myDocuments.find(document => document.id == documentId) as any;
    this.downloadFile(documentObject?.blob as string, documentObject?.fileName as string);
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

  deleteAdditionalDocument(documentId: number) {
    this.employeeDocumentService.deleteEmployeeDocument(documentId).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Deleted", "snack-success");
        this.getAdditionalDocuments();
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  getAdditionalDocuments() {
    if (this.employeeId != undefined) {
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 1).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.myDocuments = data;
          this.dataSource.data = this.fileCategories;
          this.getAdditionalDocumentReferences();
        },
        error: (er) => this.snackBarService.showError(er),
      })
    } else {
      this.employeeId = this.navService.employeeProfile.id;
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeId, 1).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.myDocuments = data;
          this.dataSource.data = this.fileCategories;
          this.getAdditionalDocumentReferences();

        },
        error: (er) => this.snackBarService.showError(er),
      })
    }
  }

  getAdditionalDocumentReferences() {
    const filteredDocuments = this.sharedAccordionFunctionality.myDocuments.filter(document => document.reference !== "");
    this.fileCategories = filteredDocuments.map(document => ({
      name: document.reference,
      id: document.id,
    }));
  }

  getFileName(documentId: number): EmployeeDocument {
    var documentObject = this.sharedAccordionFunctionality.myDocuments.find(document => document.id == documentId) as EmployeeDocument;
    return documentObject;
  }
}