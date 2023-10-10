import { Component } from '@angular/core';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';

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
  constructor(private employeeBankingService: EmployeeBankingService) { }

  ngOnInit() {
    this.employeeBankingService.getPending().subscribe(dataArray => {
      this.pendingBankStatements = dataArray;
      console.log(this.pendingBankStatements)
    })
  }

  viewEntry(entry: EmployeeBanking) {
    this.selectedEntry = entry;
    this.showDetailedEntry = true;
  }

  showTable() {
    this.selectedEntry = null;
    this.showDetailedEntry = false;
  }


  onFileSelected(event: any) {
    console.log(event.target.files[0]);
    this.fileToUpload = event.target.files[0] as File;
  }

  convertFileToBase64() {
    if(this.selectedEntry?.file)
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
}
