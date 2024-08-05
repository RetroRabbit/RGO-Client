import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { accountTypes } from 'src/app/models/hris/constants/accountTypes.constants';
import { banks } from 'src/app/models/hris/constants/banks.constants';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeBankingService } from 'src/app/services/hris/employee/employee-banking.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';
import { SharedAccordionFunctionality } from '../../shared-accordion-functionality';

@Component({
  selector: 'app-accordion-banking',
  templateUrl: './accordion-banking.component.html',
  styleUrls: ['./accordion-banking.component.css']
})
export class AccordionBankingComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @Input() employeeProfile !: EmployeeProfile | SimpleEmployee;
  @Output() updateBanking = new EventEmitter<{ progress: number, status: number }>();

  shouldUseSentInProfile: boolean = true;
  panelOpenState: boolean = false;
  bankInformationProgress: number = 0;
  employeeBanking: EmployeeBanking[] = [];
  hasBankingData: boolean = false;
  accountTypes = accountTypes;
  banks = banks;
  editBanking: boolean = false;
  hasFile: boolean = false;
  bankingPDFName: string = "";
  selectedFile !: File;
  isUpdated: boolean = false;
  employeeBankingDto !: any;
  bankingReason: string = "";
  bankingId: number = 0;
  bankingFormProgress: number = 0;
  hasUpdatedBanking: boolean = false;
  bankingUpdate: string = "";
  accountNumber: string = '';
  accountBranch: string = '';
  accountType: any;
  bank: any;

  employeeBankingsForm: FormGroup = this.fb.group({
    accountHolderName: [{ value: '', disabled: true }, Validators.required],
    accountType: [{ value: -1, disabled: true }, Validators.required],
    bankName: [{ value: '', disabled: true }, Validators.required],
    accountNo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    branch: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    file: [{ value: '', disabled: true }, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private employeeBankingService: EmployeeBankingService,
    private snackBarService: SnackbarService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private employeeBankingStarterkitService: EmployeeBankingandstarterkitService) {
  }

  ngOnInit(): void {
    this.getEmployeeBankingData();
    this.banks = this.banks.slice().sort((a, b) => a.value.localeCompare(b.value));
  }

  setInputValueCheck() {
    this.bank = this.employeeBankingsForm.get('bankName')?.value !== null;
    this.accountType = this.employeeBankingsForm.get('accountType')?.value !== null;
    this.accountNumber = this.employeeBankingsForm.get('accountNo')?.value;
    this.accountBranch = this.employeeBankingsForm.get('branch')?.value;
  }

  isInputEmpty(valueToCheck: string): boolean {
    return valueToCheck === null || valueToCheck === '';
  }

  getEmployeeBankingData() {
    this.employeeBankingService.getBankingDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.employeeBanking = data;
        if (this.employeeBanking && this.employeeBanking.length > 0) {
          this.bankingId = this.employeeBanking[this.employeeBanking.length - 1].id;
          this.initializeBankingForm(this.employeeBanking[this.employeeBanking.length - 1]);
        }
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  initializeBankingForm(bankingDetails: EmployeeBanking) {
    if (bankingDetails == null) {
      this.hasBankingData = false;
      return;
    }
    this.employeeBankingsForm = this.fb.group({
      accountType: [{ value: bankingDetails.accountType, disabled: true }, Validators.required],
      bankName: [{ value: bankingDetails.bankName, disabled: true }, Validators.required],
      accountNo: [{ value: bankingDetails.accountNo, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      branch: [{ value: bankingDetails.branch, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      file: [{ value: bankingDetails.file, disabled: true }, Validators.required],
    });
    this.setInputValueCheck();
    this.hasBankingData = true;
    this.checkBankingInformationProgress();
    this.totalBankingProgress();
    this.bankingUpdate = `${new Date().getDate()} ${this.returnMonth(new Date().getMonth() + 1)} ${new Date().getFullYear()}`;
  }

  convertFileToBase64() {
    if (this.employeeBanking[this.employeeBanking.length - 1].file)
      this.downloadFile(this.employeeBanking[this.employeeBanking.length - 1].file, `${this.employeeProfile?.name} ${this.employeeProfile?.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');

    if (commaIndex !== -1) {
      base64String = base64String.slice(commaIndex + 1);
    }

    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }


  openFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.bankingPDFName = this.selectedFile.name;
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.employeeBankingsForm.patchValue({ 'file': base64String });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editBankingDetails() {
    this.editBanking = true;
    this.employeeBankingsForm.enable();
  }

  cancelBankingDetails() {
    this.editBanking = false;
    this.employeeBankingsForm.disable();
  }

  saveBankingDetails() {
    if (this.bankingPDFName.length >= 1) {
      this.editBanking = false;
      this.isUpdated = true;
      const employeeBankingFormValue = this.employeeBankingsForm.value;
      this.employeeBankingDto = {
        id: this.bankingId,
        employeeId: this.employeeProfile?.id,
        bankName: employeeBankingFormValue.bankName,
        branch: `${employeeBankingFormValue.branch}`,
        accountNo: `${employeeBankingFormValue.accountNo}`,
        accountType: employeeBankingFormValue.accountType,
        status: 1,
        declineReason: this.bankingReason,
        file: employeeBankingFormValue.file
      }
      if (this.hasBankingData) {
        this.employeeBankingService.updatePending(this.employeeBankingDto).subscribe({
          next: () => {
            this.addOrUpdateBanking("Updated")
          },
          error: (er) => this.snackBarService.showError(er)
        })
      }
      else {
        this.employeeBankingService.addBankingDetails(this.employeeBankingDto).subscribe({
          next: () => {
            this.addOrUpdateBanking("Saved")
          },
          error: (er) => this.snackBarService.showError(er)
        })
      }
    }
    else {
      this.snackBarService.showSnackbar("Add a Proof of account", "snack-error")
    }
  }

  addOrUpdateBanking(message: string) {
    this.snackBarService.showSnackbar(message, "snack-success");
    this.getEmployeeBankingData();
    this.checkBankingInformationProgress();
    this.totalBankingProgress();
    this.employeeBankingStarterkitService.getAllBankingAndStarterkits();
    this.hasUpdatedBanking = true;
    this.editBanking = false;
    this.employeeBankingsForm.disable();
    if (message = "Saved") {
      this.employeeBankingStarterkitService.incrementPendingCount();
    }
  }

  totalBankingProgress() {
    if (this.employeeBanking.length > 0) {
      this.bankInformationProgress = Math.floor(this.bankingFormProgress);
      this.updateBanking.emit({ progress: this.bankInformationProgress, status: this.employeeBanking[this.employeeBanking.length - 1].status });
    } else {
      console.error('Employee banking data is empty.');
    }
  }

  checkBankingInformationProgress() {
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.employeeBankingsForm.controls;
    totalFields = (Object.keys(this.employeeBankingsForm.controls).length);
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value !== '') {
          filledCount++;
        }
      }
    }
    this.bankingFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  returnMonth(month: number): string {
    switch (month) {
      case 1: return 'January'
      case 2: return 'February'
      case 3: return 'March'
      case 4: return 'April'
      case 5: return 'May'
      case 6: return 'June'
      case 7: return 'July'
      case 8: return 'August'
      case 9: return 'September'
      case 10: return 'October'
      case 11: return 'November'
      case 12: return 'December'
    }
    return 'month';
  }
}
