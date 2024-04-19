import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { Location } from '@angular/common';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { Document } from 'src/app/models/hris/constants/documents.contants';

@Component({
  selector: 'app-pending-employee-starterkits',
  templateUrl: './view-starter-kit-approval.component.html',
  styleUrls: ['./view-starter-kit-approval.component.css']
})
export class ViewStarterKitApprovalComponent {

  declineReason: string = "";
  selectedReason: string = "";

  isLoading: boolean = true;
  showConfirmDialog: boolean = false;

  documenetIndex: number = 0;

  activeButtonIndex: number | null = null;
  activeButtonType: 'approve' | 'decline' | null = null;

  dialogTypeData!: Dialog;
  documentId = this.route.snapshot.params['id'];
  employee: any;
  employeeDocuments: EmployeeDocument[] = [];
  fileCategories = Document;

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  constructor(private cookieService: CookieService, private router: Router,
    private route: ActivatedRoute, private location: Location,
    private snackBarService: SnackbarService, private documentService: EmployeeDocumentService,
    private changeDetector: ChangeDetectorRef, private employeeService: EmployeeProfileService
  ) { }

  ngOnInit(): void {
    this.getEmployeeDocuments(this.documentId);
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  backToApprovals() {
    this.router.navigateByUrl('/employees')
  }

  getEmployeeDocuments(id: number) {
    this.documentService.getAllEmployeeDocuments(id).subscribe({
      next: documents => {
        this.employeeDocuments = documents;
        this.employeeService.getEmployeeById(this.employeeDocuments[this.employeeDocuments.length - 1].employeeId).subscribe({
          next: employee => {
            this.employee = employee;
            this.isLoading = false;
          }
        });
      },
      error: () => this.snackBarService.showSnackbar(`Error fetching employee documents`, "snack-error")
    })
  }

  getFile(index: number): EmployeeDocument | null {
    if (index > this.employeeDocuments.length - 1) return null;

    var documentObject = this.employeeDocuments.find(document => document.fileCategory == index) as EmployeeDocument;
    return documentObject;
  }

  disableDownload(index: number) {
    const documentObject = this.employeeDocuments.find(document => document.fileCategory == index);

    if (documentObject == undefined)
      return false;

    return true;
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

  downloadDocument(event: any, index: number) {
    if (this.employeeDocuments[index]?.blob) {
      const documentObject = this.employeeDocuments[index];
      this.downloadFile(documentObject.blob, documentObject.fileName);
    }
  }

  updateDocument(documentIndex: number, updateStatus: number = 0) {
    let copyOfDocument = updateStatus == 2 ? { ...this.getFile(this.documenetIndex) } : { ...this.getFile(documentIndex) };
    copyOfDocument.status = updateStatus;

    if (updateStatus == 2)
      copyOfDocument.reason = `${this.selectedReason} ${this.declineReason}`;
    else
      copyOfDocument.reason = ``;

    this.documentService.updateEmployeeDocument(copyOfDocument as EmployeeDocument).subscribe({
      next: () => {
        this.snackBarService.showSnackbar(`Document has successfully updated`, "snack-success");
        this.getEmployeeDocuments(this.documentId);
      },
      error: () => this.snackBarService.showSnackbar(`Something happened.Please try again later`, "snack-error")
    });
  }

  openDialog(documentIndex: number): void {
    this.documenetIndex = documentIndex;
    this.dialogTypeData = {
      type: 'decline',
      title: 'Decline Update',
      subtitle: 'Please provide a reason for declining this update',
      confirmButtonText: 'Decline Update',
      denyButtonText: 'Cancel'
    };
    this.showConfirmDialog = true;
  }

  dialogFeedBack(response: any): void {
    this.declineReason = response.declineReason;
    this.selectedReason = response.selectedReason;
    if (!response.confirmatio)
      this.updateDocument(this.documenetIndex, 2);
    else
      this.backToApprovals();
  }

  convertFileToBase64(index: number) {
    if (this.employeeDocuments[index]?.blob) {
      const newOrOld = this.employeeDocuments.length > 1 ? 'Update' : 'Current'
      this.downloadFile(this.employeeDocuments[index]?.blob, `${this.employee.name}_${this.employee.surname}_${newOrOld}_Proof_of_Account.pdf`);
    }
  }
}