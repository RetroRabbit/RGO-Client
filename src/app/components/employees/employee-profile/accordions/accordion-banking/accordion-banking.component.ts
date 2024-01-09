import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { accountTypes } from 'src/app/models/constants/accountTypes.constants';
import { banks } from 'src/app/models/constants/banks.constants';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-accordion-banking',
  templateUrl: './accordion-banking.component.html',
  styleUrls: ['./accordion-banking.component.css']
})
export class AccordionBankingComponent {

  @Input() employeeProfile !: EmployeeProfile;
  @Output() updateBanking = new EventEmitter<{progress: number, status : number}>();

  shouldUseSentInProfile: boolean = true;
  panelOpenState: boolean = false;
  bankInformationProgress: number = 0;
  employeeBanking !: EmployeeBanking;
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
    private snackBarService: SnackbarService) {
  }

  ngOnInit() {
    this.getEmployeeBankingData();
  }

  getEmployeeBankingData() {
    this.employeeBankingService.getBankingDetails(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.employeeBanking = data;
        if(this.employeeBanking != null){
          this.bankingId = this.employeeBanking.id;
        }
        this.initializeBankingForm(this.employeeBanking);
      }
    })
  }

  initializeBankingForm(bankingDetails: EmployeeBanking) {
    if (bankingDetails == null) {
      this.hasBankingData = false;
      return;
    }
    this.employeeBankingsForm = this.fb.group({
      accountHolderName: [{ value: bankingDetails.accountHolderName, disabled: true }, Validators.required],
      accountType: [{ value: bankingDetails.accountType, disabled: true }, Validators.required],
      bankName: [{ value: bankingDetails.bankName, disabled: true }, Validators.required],
      accountNo: [{ value: bankingDetails.accountNo, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      branch: [{ value: bankingDetails.branch, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      file: [{ value: bankingDetails.file, disabled: true }, Validators.required],
    });
    this.hasFile = bankingDetails.file.length > 0;
    this.hasBankingData = true;
    this.checkBankingInformationProgress();
    this.totalBankingProgress();
    this.bankingUpdate = `${new Date().getDate()} ${this.returnMonth(new Date().getMonth() + 1)} ${new Date().getFullYear()}`;
  }

  convertFileToBase64() {
    if (this.employeeBanking.file)
      this.downloadFile(this.employeeBanking.file, `${this.employeeProfile?.name} ${this.employeeProfile?.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');
    if (commaIndex !== -1) {
      base64String = base64String.slice(commaIndex + 1);
    }
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
    this.editBanking = false;
    this.isUpdated = true;
    const employeeBankingFormValue = this.employeeBankingsForm.value;
    this.employeeBankingDto = {
      id: this.bankingId,
      accountHolderName: employeeBankingFormValue.accountHolderName,
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
          this.snackBarService.showSnackbar("Banking details updated", "snack-success");
          this.getEmployeeBankingData();
          this.checkBankingInformationProgress();
          this.totalBankingProgress();
          this.hasUpdatedBanking = true;
          this.editBanking = false;
          this.employeeBankingsForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
    }
    else {
      this.employeeBankingService.addBankingDetails(this.employeeBankingDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Banking details added", "snack-success");
          this.getEmployeeBankingData();
          this.checkBankingInformationProgress();
          this.totalBankingProgress();
          this.hasUpdatedBanking = true;
          this.editBanking = false;
          this.employeeBankingsForm.disable();
        }
        , error: (error) => {
          this.snackBarService.showSnackbar("Failed to create banking information", "snack-error");
        }
      })
    }
  }

  totalBankingProgress() {
    this.bankInformationProgress = Math.floor(this.bankingFormProgress);
    this.updateBanking.emit({progress: this.bankInformationProgress, status: this.employeeBanking.status});
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
