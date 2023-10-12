import { Component } from '@angular/core';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-pending-bank-statements',
  templateUrl: './pending-bank-statements.component.html',
  styleUrls: ['./pending-bank-statements.component.css']
})
export class PendingBankStatementsComponent {

  pendingBankStatements: EmployeeBanking[] = [];
  showDetailedEntry: boolean = false;
  selectedEntry: EmployeeBanking | null = null;
  proofOfAccount_64: string = "";
  base64String: string = '';
  fileToUpload: File | null = null;
  copyOfSelected: EmployeeBanking | null = null;
  reason : string = "";

  constructor(
    private employeeBankingService: EmployeeBankingService,
    private toast: NgToastService) { }

  ngOnInit() {
    this.fetchPending();
    
  }
  
  fetchPending(){
    this.employeeBankingService.getPending().subscribe(dataArray => {
      this.pendingBankStatements = dataArray;
    })
  }

  viewEntry(entry: EmployeeBanking) {
    this.selectedEntry = entry;
    this.copyOfSelected = JSON.parse(JSON.stringify(this.selectedEntry));
    this.showDetailedEntry = true;
  }

  showTable() {
    this.selectedEntry = null;
    this.copyOfSelected = null;
    this.showDetailedEntry = false;
    this.reason = "";
  }

  convertFileToBase64() {
    if (this.selectedEntry?.file)
      this.downloadFile(this.selectedEntry?.file, `${this.selectedEntry?.employee.name} ${this.selectedEntry?.employee.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
    const byteString = atob(base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'application/pdf' });

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
      this.copyOfSelected.reason = this.reason;
    }
    const updateData = { ...this.copyOfSelected };
    delete updateData.employee;
    this.employeeBankingService.updatePending(updateData).subscribe( (data) => {
      this.toast.success({detail:"Success",summary:`${this.copyOfSelected?.accountHolderName} has been updated`,duration:5000, position:'topRight'});
      this.showTable();
      this.ngOnInit();
    },
    (error) => {
      this.toast.error({detail:"Error",summary: error,duration:5000, position:'topRight'});
    });
  }
}
