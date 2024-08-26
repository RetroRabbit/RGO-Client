import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/hris/employee/employee-banking.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SharedAccordionFunctionality } from '../../employee-profile/shared-accordion-functionality';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { accountTypes } from 'src/app/models/hris/constants/accountTypes.constants';

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
  employeeBanking: EmployeeBanking[] = [];
  bankingId = this.route.snapshot.params['id'] ?? this.authAccessService.getUserId();
  showConfirmDialog: boolean = false;
  dialogTypeData!: Dialog;
  employee: any;
  currentBanking: EmployeeBanking | null = null;
  currentBankingExists: boolean = false;
  updateBanking: EmployeeBanking | null = null;
  updateBankingExists: boolean = false;
  accountTypes: any;
  

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public authAccessService: AuthAccessService,
    public navService: NavService,
    private employeeBankingService: EmployeeBankingService,
    private router: Router, 
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getBankingDetails(this.bankingId);
    this.accountTypes = accountTypes;
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
        next: (data: any) => {
          this.employeeBanking = data;
          this.employee = this.sharedAccordionFunctionality.employees.filter((employee: EmployeeProfile) => employee.id === data[0].employeeId);
          this.isLoading = false;
          console.log(data)
          this.getCurrentDetails()
          this.getUpdateDetails()
        }
      });
    }
  }

  getCurrentDetails(){
    this.currentBanking = this.employeeBanking.find(x => x.status === 0)!
    if(this.currentBanking){
      this.currentBankingExists = true;
    }
  }

  getUpdateDetails(){
    this.updateBanking = this.employeeBanking.find(x => x.status == 1)!
    if(this.updateBanking){
      this.updateBankingExists = true;
    }
  }

  getName(){
    return this.employee[0].name;
  }

  getSurname(){
    return this.employee[0].surname;
  }

  getProfileImage(){
    return this.employee[0].photo ?? 'assets/img/default-profile-image.png' ;
  }

  getAccountType(id : number){
    if(id == 0){
      return 'Savings'
    }
    else{
      return 'Cheque'
    }
  }

  getPOA(){
    const name = this.getName() || 'Unknown';
    const surname = this.getSurname() || 'Unknown';
    return `${name}_${surname}_POA.pdf`;
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

  updateBankingDetails(status: number): void {
    let copyOfBanking = { ...this.employeeBanking[this.employeeBanking.length - 1] };
    copyOfBanking.status = status;
    if (status == 2)
    {
      copyOfBanking.declineReason = `${this.selectedReason} ${this.declineReason}`;
    }
    else
    {      
      copyOfBanking.declineReason = ``;
    }

    var previousId = this.employeeBanking.find(x => x.status == 0)?.id;

    if(this.currentBankingExists){
      this.employeeBankingService.deleteBankingDetails(previousId!)
      .subscribe({
        next: ( ) => {
          this.employeeBankingService.updatePending(copyOfBanking).subscribe({
            next: () => {
              this.snackBarService.showSnackbar("Updated", "snack-success");
              this.backToApprovals();
               this.changeDetector.detectChanges();
            },
            error: (er) => this.snackBarService.showError(er),
          })
        }
      })
    }else{
      this.employeeBankingService.updatePending(copyOfBanking).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Updated", "snack-success");
          this.backToApprovals();
           this.changeDetector.detectChanges();
        },
        error: (er) => this.snackBarService.showError(er),
      })
    }
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
    this.updateBankingDetails(2);
      }
     
  }
}
