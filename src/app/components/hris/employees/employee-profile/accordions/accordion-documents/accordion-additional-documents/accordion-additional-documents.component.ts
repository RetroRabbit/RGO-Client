import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';

@Component({
  selector: 'app-accordion-additional-documents',
  templateUrl: './accordion-additional-documents.component.html',
  styleUrls: ['./accordion-additional-documents.component.css']
})
export class AccordionDocumentsCustomDocumentsComponent {
  @Output() updateDocument = new EventEmitter<number>();
  @Input() employeeProfile!: EmployeeProfile;

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  customFields: CustomField[] = [];
  additionalDocuments: EmployeeDocument[] = [];
  fileCategories = [];
  isLoadingUpload: boolean = false;
  uploadButtonIndex: number = 0;
  documentFormProgress: number = 0;
  selectedFile !: File;
  documentsFileName: string = "";
  PREVIOUS_PAGE = "previousPage";
  allowedTypes = ['application/pdf'];
  base64String: string = "";
  employeeId = this.route.snapshot.params['id'];
  dataSource = new MatTableDataSource<string>();

  constructor(
    private customFieldService: CustomFieldService,
    private route: ActivatedRoute,
    private employeeDocumentService: EmployeeDocumentService,
    private fb: FormBuilder,
    public navService: NavService,
    private snackBarService: SnackbarService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) { }

  ngOnInit() {
    this.getDocumentFields();
    this.getAdditionalDocuments();
  }

  getDocumentFields() {
    this.getDocumentFieldCodes();
  }

  getDocumentsFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[3].id);
        this.checkCustomDocumentsInformation();
      }
    })
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

  uploadDocument(event: any) {
    this.isLoadingUpload = true;
    this.selectedFile = event.target.files[0];
    this.documentsFileName = this.selectedFile.name;
    if (this.allowedTypes.includes(this.selectedFile.type)) {
      this.uploadProfileDocument();
    } else {
      this.snackBarService.showSnackbar("Please upload a PDF", "snack-error");
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
          employeeFileCategory: +this.uploadButtonIndex,
          blob: this.base64String,
          status: 1,
          documentType: 2,
          uploadDate: new Date(),
          reason: '',
          counterSign: false,
          lastUpdatedDate: new Date()
        };
        this.uploadDocumentDto(newDto);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadDocumentDto(document: any) {
    const saveObj = {
      id: document.id,
      employeeId: document.employee.id,
      fileName: document.fileName,
      blob: this.base64String,
      fileCategory: 0,
      employeeFileCategory: +this.uploadButtonIndex,
      uploadDate: document.uploadDate,
      status: 1,
      documentType: 2,
    }
    if (!document.id) {
      this.employeeDocumentService.saveEmployeeDocument(saveObj, 2).subscribe({
        next: () => {
          this.isLoadingUpload = false;
          this.snackBarService.showSnackbar("Document added", "snack-success");
          this.getAdditionalDocuments();
          this.calculateDocumentProgress();
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
        employeeFileCategory: +this.uploadButtonIndex,
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
          this.snackBarService.showSnackbar("Document updated", "snack-success");
          this.getAdditionalDocuments();
          this.calculateDocumentProgress();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
          this.isLoadingUpload = false;
        }
      });
    }
  }

  getAdditionalDocuments() {
    if (this.employeeId != undefined) {
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeProfile.id as number, 2).subscribe({
        next: data => {
          this.additionalDocuments = data;
          this.dataSource.data = this.fileCategories;
          this.calculateDocumentProgress();
        },
        error: error => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    } else {
      this.employeeId = this.navService.employeeProfile.id;
      this.employeeDocumentService.getAllEmployeeDocuments(this.employeeId, 0).subscribe({
        next: data => {
          this.additionalDocuments = data;
          this.dataSource.data = this.fileCategories;
          this.calculateDocumentProgress();
        },
        error: error => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    }
  }

  downloadDocument(event: any) {
    const id = event.srcElement.parentElement.id;
    const documentObject = this.additionalDocuments.find(document => document.employeeFileCategory == id) as any;
    this.downloadFile(documentObject?.blob as string, documentObject?.fileName as string);
  }

  getFileName(index: number): EmployeeDocument {
    var documentObject = this.additionalDocuments.find(document => document.employeeFileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  captureUploadIndex(event: any) {
    this.uploadButtonIndex = event.srcElement.parentElement.id;
    const inputField = document.getElementById(`${this.uploadButtonIndex}-document`) as HTMLInputElement;
    inputField.click();
  }

  filterDocumentsByCategory(): EmployeeDocument | null {
    var object = this.additionalDocuments.filter(document => document.employeeFileCategory == this.uploadButtonIndex);
    if (object == null) {
      return null;
    }
    return object[0];
  }

  checkCustomDocumentsInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.sharedAccordionFunctionality.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id)
        formGroupConfig[fieldName.code] = new FormControl({ value: customData[0] ? customData[0].value : '', disabled: true });
        this.sharedAccordionFunctionality.additionalInfoForm = this.fb.group(formGroupConfig);
        if (fieldName.required == true) {
          this.sharedAccordionFunctionality.additionalInfoForm.controls[fieldName.code].setValidators(Validators.required);
        }
        this.sharedAccordionFunctionality.additionalInfoForm.disable();
      }
    });
  }
  disableDownload(index: number) {
    const documentObject = this.additionalDocuments.find(document => document.employeeFileCategory == index);

    if (documentObject == undefined)
      return false;

    return true;
  }
  getDocumentFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[3].id);
        this.checkCustomDocumentsInformation();
      }
    })
  }

  calculateDocumentProgress() {
    const total = this.fileCategories.length;
    const fetchedDocuments = this.additionalDocuments.filter(document => document.employeeFileCategory <= 9).length;
    this.documentFormProgress = fetchedDocuments / total * 100;
    this.updateDocument.emit(this.documentFormProgress);
  }
}
