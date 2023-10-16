import { Component } from '@angular/core';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';
import { NgToastService } from 'ng-angular-popup';
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

  constructor(
    private employeeBankingService: EmployeeBankingService,
    private toast: NgToastService) { }

  ngOnInit() {
    this.fetchPending();
    
  }
  
  fetchPending(){
    this.employeeBankingService.getPending().subscribe(dataArray => {
      this.pendingBankApplications = dataArray;
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
      this.toast.error({detail:"Error",summary: "You must provide a reason for rejecting an application",duration:5000, position:'topRight'});
      return;
    }
    if(updateData.status == 1){
      this.toast.error({detail:"Error",summary: "You must provide a response to submit",duration:5000, position:'topRight'});
      return;
    }
    this.employeeBankingService.updatePending(updateData).subscribe( (data) => {
      this.toast.success({detail:"Success",summary:`${this.copyOfSelected?.accountHolderName} has been updated`,duration:5000, position:'topRight'});
      this.showTable();
      this.ngOnInit();
    },
    (error) => {
      this.toast.error({detail:"Error",summary: "Please try again later",duration:5000, position:'topRight'});
    });
  }
}
