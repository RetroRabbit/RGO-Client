import { Component, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { ActivatedRoute } from '@angular/router';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { MatTableDataSource } from '@angular/material/table';
import { FileCategory } from 'src/app/models/hris/constants/documents.contants';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { StoreAccessService } from 'src/app/services/shared-services/store-service/store-access.service';

@Component({
  selector: 'app-accordion-additional-documents',
  templateUrl: './accordion-additional-documents.component.html',
  styleUrls: ['./accordion-additional-documents.component.css']
})
export class AccordionDocumentsCustomDocumentsComponent {
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  fileCategories = [];
  unarchivedCustomDocuments: CustomField[] = [];
  customFields: CustomField[] = [];
  roles: string[] = [];
  isLoadingUpload: boolean = false;
  uploadButtonIndex: number = 0;
  documentFormProgress: number = 0;
  documentId: number = 0;
  fieldCodeStatus: any = -1;
  customDocumentsCategory: number = 3;
  selectedFile !: File;
  documentsFileName: string = "";
  DocumentTypeName: string = "";
  PREVIOUS_PAGE = "previousPage";
  allowedTypes = ['application/pdf'];
  base64String: string = "";
  employeeId = this.route.snapshot.params['id'];
  dataSource = new MatTableDataSource<FileCategory>(this.fileCategories);
  infinity = Infinity;
  selectedFieldCode: string = '';

  constructor(
    private storeAccessService: StoreAccessService,
    private route: ActivatedRoute,
    private employeeDocumentService: EmployeeDocumentService,
    private fb: FormBuilder,
    public navService: NavService,
    private authAccessService: AuthAccessService,
    private snackBarService: SnackbarService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) { }

  ngOnInit() {
    this.roles = [this.authAccessService.getRole()];
    this.getDocumentFieldCodes();
    this.getAdditionalDocuments();
  }

  getAdditionalDocuments() {
    if (this.employeeId != undefined) {
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 4).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.additionalDocuments = data;
          this.dataSource.data = this.fileCategories;

          this.sharedAccordionFunctionality.additionalDocuments = data;
          this.getDocumentFieldCodes();
          this.sharedAccordionFunctionality.calculateAdditionalDocumentProgress();
        },
        error: (er) => this.snackBarService.showError(er),
      });
    } else {
      this.employeeId = this.navService.employeeProfile.id;
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeId, 4).subscribe({
        next: data => {
          this.sharedAccordionFunctionality.additionalDocuments = data;
          this.sharedAccordionFunctionality.calculateAdditionalDocumentProgress();
        },
        error: (er) => this.snackBarService.showError(er),
      });
    }
  }

  filterDocumentsByCategory(): EmployeeDocument | null {
    var object = this.sharedAccordionFunctionality.additionalDocuments.filter(document => document.fileCategory == this.uploadButtonIndex);
    if (object == null) {
      return null;
    }
    return object[0];
  }

  checkCustomDocumentsInformation() {
    const formGroupConfig: any = {};
    this.sharedAccordionFunctionality.customFieldsDocuments.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.sharedAccordionFunctionality.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id)
        formGroupConfig[fieldName.code] = new FormControl({ value: customData[0] ? customData[0].value : '', disabled: true });
        this.sharedAccordionFunctionality.additionalDocumentForm = this.fb.group(formGroupConfig);
        if (fieldName.required == true) {
          this.sharedAccordionFunctionality.additionalDocumentForm.controls[fieldName.code].setValidators(Validators.required);
        }
        this.sharedAccordionFunctionality.additionalDocumentForm.disable();
      }
    });
  }

  getDocumentFieldCodes() {
    var data = this.storeAccessService.getFieldCodes();
    const documentFieldCodes = data.filter(fieldCode => fieldCode.type === 5); 
    this.checkCustomDocumentsInformation();
    this.checkArchived(documentFieldCodes);
  }

  checkArchived(fields: CustomField[]) {
    this.unarchivedCustomDocuments = [];
    var index = 0;
    fields.forEach((field) => {
      if (this.fieldCodeStatus == field.status && this.customDocumentsCategory == field.category) {
        fields.splice(index, 1);
      }
      else {
        this.unarchivedCustomDocuments.push(field);
        this.customFields = this.unarchivedCustomDocuments.filter((field: any) => field.category == this.sharedAccordionFunctionality.category[3].id)
      }
      index++;
    })
  }

  captureUploadButtonIndex(event: any, category: any) {
    this.selectedFieldCode = category;
    this.uploadButtonIndex = event.srcElement.offsetParent.id;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-additional-document`) as HTMLInputElement;
    inputField.click();
  }

  captureFileUploaded(event: any) {
    this.isLoadingUpload = true;
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    if (this.allowedTypes.includes(this.selectedFile.type)) {
      this.readUploadedDocument();
    }
    else {
      this.snackBarService.showSnackbar("Upload PDF Only", "snack-error");
      this.isLoadingUpload = false;
    }
  }

  readUploadedDocument() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.createDocumentDto();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  createDocumentDto() {
    const existingValue = this.filterDocumentsByReference();
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64String = reader.result as string;
        let newDto: {} = {
          id: existingValue != undefined ? existingValue?.id as number : 0,
          employeeId: this.employeeProfile.id,
          fileName: this.documentsFileName,
          fileCategory: 0,
          employeeFileCategory: 0,
          adminFileCategory: 0,
          blob: this.base64String,
          uploadDate: new Date(),
          reference: this.selectedFieldCode,
          lastUpdatedDate: new Date()
        };
        this.saveDocumentDto(newDto);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveDocumentDto(document: any) {
    if (!document.id) {
      this.employeeDocumentService.saveEmployeeDocument(document, 4).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Saved", "snack-success");
          this.getAdditionalDocuments();
          this.sharedAccordionFunctionality.calculateAdditionalDocumentProgress();
        },
        error: (er: any) => {
          this.isLoadingUpload = false;
          this.snackBarService.showError(er);
        }
      })

    } else {
      const updatedDocument = {
        id: document.id,
        employeeId: document.employeeId,
        reference: document.reference,
        fileName: document.fileName,
        fileCategory: document.fileCategory,
        adminFileCategory: document.adminFileCategory,
        employeeFileCategory: +this.uploadButtonIndex,
        blob: document.blob,
        uploadDate: document.uploadDate,
        reason: document.reason,
        status: 1,
        counterSign: false,
        documentType: 4,
        lastUpdatedDate: document.lastUpdatedDate,
      }
      this.employeeDocumentService.updateEmployeeDocument(updatedDocument).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.getAdditionalDocuments();
          this.sharedAccordionFunctionality.calculateAdditionalDocumentProgress();

        },
        error: (er) => {
          this.snackBarService.showError(er);
          this.isLoadingUpload = false;
        }
      });
    }
  }

  getDocumentName(reference: any): EmployeeDocument | null {
    let documentFound = null;
    this.sharedAccordionFunctionality.additionalDocuments.forEach(document => {
      if (document.reference == reference) {
        documentFound = document;
      }
    })
    return documentFound;

  }

  disableDownloadButton(index: number) {
    return this.sharedAccordionFunctionality.additionalDocuments[index] != null;
  }

  downloadDocumentTrigger(index: number) {
    this.downloadDocument(this.sharedAccordionFunctionality.additionalDocuments[index].blob, this.sharedAccordionFunctionality.additionalDocuments[index].fileName);
  }

  downloadDocument(base64String: string, fileName: string) {
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

  filterDocumentsByReference(): EmployeeDocument | null {
    let documentFound = null;
    this.sharedAccordionFunctionality.additionalDocuments.find(document => {
      if (document.reference == this.selectedFieldCode)
        documentFound = document
    });
    return documentFound;
  }
}
