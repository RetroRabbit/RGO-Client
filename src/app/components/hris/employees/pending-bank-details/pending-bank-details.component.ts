import { Component } from '@angular/core';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/hris/employee/employee-banking.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
@Component({
  selector: 'app-pending-bank-statements',
  templateUrl: './pending-bank-details.component.html',
  styleUrls: ['./pending-bank-details.component.css']
})
export class PendingBankDetailsComponent {

  pendingBankApplications: EmployeeBanking[] = [];
  showDetailedEntry: boolean = false;
  selectedApplication: EmployeeBanking | null = null;
  base64String: string = '';
  fileToUpload: File | null = null;
  copyOfSelected: EmployeeBanking | null = null;
  declineReason : string = "";
  isLoading: boolean = true;
  constructor(
    private employeeBankingService: EmployeeBankingService,
    private snackBarService: SnackbarService,
    private navService: NavService) {
     }

  ngOnInit() {
    this.fetchPending();

  }

  fetchPending(){
    this.employeeBankingService.getPending(1).subscribe({
      next: data => {
        this.pendingBankApplications = data;
      }, 
      error: (er) => this.snackBarService.showError(er),
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  viewEntry(entry: EmployeeBanking) {
    this.selectedApplication = entry;
    this.copyOfSelected = JSON.parse(JSON.stringify(this.selectedApplication));
    this.showDetailedEntry = true;
  }

  showTable() {
    this.selectedApplication = null;
    this.copyOfSelected = null;
    this.showDetailedEntry = false;
    this.declineReason = "";
  }

  convertFileToBase64() {
    if (this.selectedApplication?.file)
      this.downloadFile(this.selectedApplication?.file, `${this.selectedApplication?.employee.name} ${this.selectedApplication?.employee.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
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


  setSelectedResponse(event: any) {
    if (this.copyOfSelected) {
      this.copyOfSelected.status = +event.value;
    }
  }

  updateEntry() {
    if (this.copyOfSelected) {
      this.copyOfSelected.declineReason = this.declineReason;
    }
    const updateData = { ...this.copyOfSelected };
    delete updateData.employee;

    if(updateData.status == 2 && this.declineReason == ''){
      this.snackBarService.showSnackbar("You Must Provide a Reason for Rejecting an Application", "snack-error");
      return;
    }
    if(updateData.status == 1){
      this.snackBarService.showSnackbar("You Must Provide a Response to Submit", "snack-error");
      return;
    }
    this.employeeBankingService.updatePending(updateData).subscribe( (data) => {
      this.snackBarService.showSnackbar("Updated", "snack-success");
      this.showTable();
      this.ngOnInit();
    },
    (error) => {
      this.snackBarService.showSnackbar("Unable to Update Pending Bank Information", "snack-error");
    });
  }
}
