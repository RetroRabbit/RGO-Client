import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/hris/employee/employee-banking.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';

@Component({
  selector: 'app-view-banking-approval',
  templateUrl: './view-banking-approval.component.html',
  styleUrls: ['./view-banking-approval.component.css']
})

export class ViewBankingApprovalComponent {
  copyOfSelected: EmployeeBanking | null = null;
  declineReason: string = "";
  selectedReason: string = "";
  isLoading: boolean = true;
  employeeBanking: any;
  bankingId = this.route.snapshot.params['id'];
  showConfirmDialog: boolean = false;
  dialogTypeData!: Dialog;
  employee: any;

  constructor(
    private employeeBankingService: EmployeeBankingService,
    private router: Router, 
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private employeeProfileService: EmployeeProfileService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getBankingDetails(this.bankingId);
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  backToApprovals() {
    this.router.navigateByUrl('/employees')
  }

  getBankingDetails(id: number): void {
    if (id && !isNaN(+id)) {
      this.employeeBankingService.getBankingDetails(id).subscribe({
        next: data => {
          this.employeeBanking = data;
          this.employeeProfileService.getEmployeeById(this.employeeBanking[this.employeeBanking.length - 1].employeeId).subscribe({
            next: employee => {
              this.employee = employee;
              this.isLoading = false;
            }
          });
        }
      });
    }
  }

  getEmployeeForBanking(id: number): void {
    this.employeeProfileService.getEmployeeById(id).subscribe({
      next: employee => {
        this.employee = employee;
      }
    });
  }

  convertFileToBase64(index: number) {
    if (this.employeeBanking[index]?.file) {
      const newOrOld = this.employeeBanking.length > 1 ? 'Update' : 'Current'
      this.downloadFile(this.employeeBanking[index]?.file, `${this.employee.name}_${this.employee.surname}_${newOrOld}_Proof_of_Account.pdf`);
    }
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

  updateBanking(status: number): void {
    let copyOfBanking = { ...this.employeeBanking[this.employeeBanking.length - 1] };
    copyOfBanking.status = status;
    if (status == 2)
      copyOfBanking.declineReason = `${this.selectedReason} ${this.declineReason}`;
    else
      copyOfBanking.declineReason = ``;

    this.employeeBankingService.updatePending(copyOfBanking).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Updated", "snack-success");
        this.backToApprovals();
         this.changeDetector.detectChanges();
      },
      error: (er) => this.snackBarService.showError(er),
    })
  }

  openDialog(): void {
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
    this.showConfirmDialog=false;
    if(response.confirmation)
      {
    this.updateBanking(2);
      }
     
  }
}
