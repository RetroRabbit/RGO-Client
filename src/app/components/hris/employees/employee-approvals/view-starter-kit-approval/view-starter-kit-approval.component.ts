import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { StarterKitDocumentTypes } from 'src/app/models/hris/constants/documents.contants';
import { EmployeeDocumentsStatus } from 'src/app/models/hris/constants/enums/employeeDocumentsStatus';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SharedAccordionFunctionality } from '../../employee-profile/shared-accordion-functionality';
@Component({
  selector: 'app-pending-employee-starterkits',
  templateUrl: './view-starter-kit-approval.component.html',
  styleUrls: ['./view-starter-kit-approval.component.css']
})
export class ViewStarterKitApprovalComponent {

  declineReason: string = "";
  selectedReason: string = "";
  lastUpdatedMessage: string = "";
  isLoading: boolean = true;
  showConfirmDialog: boolean = false;
  documentIndex: number = 0;
  activeButtonIndex: number | null = null;
  activeButtonType: 'approve' | 'decline' | null = null;
  dialogTypeData!: Dialog;
  employeedId = this.route.snapshot.params['id'];
  employee: any;
  employeeDocuments: EmployeeDocument[] = [];
  fileCategories = StarterKitDocumentTypes;
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public authAccessService: AuthAccessService,
    private router: Router,
    private route: ActivatedRoute,
    public navService: NavService,
    private snackBarService: SnackbarService,
    private documentService: EmployeeDocumentService,
    private changeDetector: ChangeDetectorRef,
    private employeeProfileService: EmployeeProfileService,
    ) { }

  ngOnInit(): void {
    this.getEmployeeDocuments(this.employeedId);
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  backToApprovals() {
    this.router.navigateByUrl('/employees')
  }

  getEmployeeDocuments(employeedId: number) {
    let staterkitDocuments = 0
    this.documentService.getAllEmployeeDocuments(employeedId, staterkitDocuments).subscribe({
      next: documents => {
        this.employeeDocuments = documents;
        this.employeeProfileService.getEmployeeById(employeedId).subscribe({
          next: employee => {
            this.employee = employee;
            this.isLoading = false;
          }
        });
        if(this.employeeDocuments.length > 0) this.lastUpdatedMessage = this.getNewDate();
      },
      error: (er) => this.snackBarService.showError(er),
    })
  }

  getNewDate() {
    let message = "";
    let currentDate = new Date();
    let updatedDate = this.employeeDocuments[0].lastUpdatedDate;
    if (this.employeeDocuments.length > 1) {
      for (let k = 0; k < this.employeeDocuments.length; k++) {
        if (this.employeeDocuments[k].lastUpdatedDate > updatedDate) {
          updatedDate = this.employeeDocuments[k].lastUpdatedDate;
        }
      }
    }

    const millisecondInDays = 1000 * 60 * 60 * 24;
    const milliDiff: number = new Date(currentDate).getTime() - new Date(updatedDate).getTime();
    const totalDays = Math.floor(milliDiff / millisecondInDays);
    const totalSeconds = Math.floor(milliDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    if (totalSeconds < 60)
      message = "Updated just now";
    else if (totalMinutes < 60)
      message = "Updated " + Math.floor(totalMinutes) + " minutes ago";
    else if (totalHours < 24)
      message = "Updated " + Math.floor(totalHours) + " hours ago";
    else if (totalDays < 7)
      message = "Updated " + Math.floor(totalDays) + " days ago";
    else if (totalDays > 7 && totalDays < 28)
      message = "Updated " + Math.floor(totalDays % 7) + " weeks ago";
    else if (totalDays >= 28)
      message = "Updated " + Math.floor(totalDays % 28) + " months ago";
    else if (totalDays >= 365)
      message = "Updated " + Math.floor(totalDays % 365) + " years ago";
    return message;
  }

  getFile(index: number): EmployeeDocument | null {
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
    let copyOfDocument = { ...this.getFile(documentIndex) };
    copyOfDocument.status = updateStatus;
    copyOfDocument.lastUpdatedDate = new Date();

    if (updateStatus == EmployeeDocumentsStatus.DECLINED)
      copyOfDocument.reason = `${this.selectedReason} ${this.declineReason}`;
    else
      copyOfDocument.reason = ``;

    this.documentService.updateEmployeeDocument(copyOfDocument as EmployeeDocument).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Updated", "snack-success");
        this.lastUpdatedMessage = this.getNewDate();
        this.getEmployeeDocuments(this.employeedId);
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  openDialog(documentIndex: number): void {
    this.documentIndex = documentIndex;
    this.dialogTypeData = {
      type: 'decline',
      title: 'Decline update',
      subtitle: 'Please provide a reason for declining this update',
      confirmButtonText: 'Decline Update',
      denyButtonText: 'Cancel'
    };
    this.showConfirmDialog = true;
  }

  dialogFeedBack(response: any): void {
    this.declineReason = response.declineReason;
    this.selectedReason = response.selectedReason;
    if (response.confirmation)
      this.updateDocument(this.documentIndex, EmployeeDocumentsStatus.DECLINED);
    this.showConfirmDialog = false;
  }

  convertFileToBase64(index: number) {
    if (this.employeeDocuments[index]?.blob) {
      const newOrOld = this.employeeDocuments.length > 1 ? 'Update' : 'Current'
      this.downloadFile(this.employeeDocuments[index]?.blob, `${this.employee.name}_${this.employee.surname}_${newOrOld}_Proof_of_Account.pdf`);
    }
  }
}
