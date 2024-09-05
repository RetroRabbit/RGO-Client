import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { accountTypes } from 'src/app/models/hris/constants/accountTypes.constants';
import { banks } from 'src/app/models/hris/constants/banks.constants';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeBankingService } from 'src/app/services/hris/employee/employee-banking.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';
import { SharedAccordionFunctionality } from '../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { FileProcessingService } from 'src/app/services/hris/file-processing.service';

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

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile }
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
  currentBankingData: EmployeeBanking | null = null;

  employeeBankingsForm: FormGroup = this.fb.group({
    accountHolderName: [{ value: '', disabled: true }, Validators.required],
    accountType: [{ value: -1, disabled: true }, Validators.required],
    bankName: [{ value: '', disabled: true }, Validators.required],
    accountNo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    branch: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    file: [{ value: '', disabled: true }, Validators.required],
  });

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private fb: FormBuilder,
    private employeeBankingService: EmployeeBankingService,
    private snackBarService: SnackbarService,
    private employeeBankingStarterkitService: EmployeeBankingandstarterkitService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private fileProcessingService: FileProcessingService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getEmployeeBankingData();
    this.banks = this.banks.slice().sort((a, b) => a.value.localeCompare(b.value));
  }

  async getEmployeeBankingData() {
    this.employeeBankingService.getBankingDetails(this.employeeProfile.employeeDetails.id as number).subscribe({
      next: async (data) => {
        this.employeeBanking = data;
        if (this.employeeBanking && this.employeeBanking.length > 0) {
          this.bankingId = this.employeeBanking[this.employeeBanking.length - 1].id;
          await this.initializeBankingForm(this.employeeBanking[this.employeeBanking.length - 1]);
          this.getCurrentBankingPdfName();
        }
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  getCurrentBankingPdfName() {
    this.bankingPDFName = this.getPOA();
  }

  getPOA() {
    const name = this.employeeProfile.employeeDetails.name || 'Unknown';
    const surname = this.employeeProfile.employeeDetails.surname || 'Unknown';
    return `${name}_${surname}_POA.pdf`;
  }

  async initializeBankingForm(bankingDetails: EmployeeBanking) {

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
    this.hasFile = !!(bankingDetails.file && bankingDetails.file.length > 0);
    this.hasBankingData = true;
    this.getBankingDate(bankingDetails);
    this.checkBankingInformationProgress();
    this.totalBankingProgress();
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.employeeBankingsForm.controls), "EmployeeBanking", true , this.employeeBankingsForm , this.employeeProfile.employeeDetails.email!)

  }

  getBankingDate(bankingDetails: EmployeeBanking) {
    if (this.hasBankingData) {
      const lastUpdateddate = new Date(bankingDetails.lastUpdateDate!);
      const day = lastUpdateddate.getDate();
      const month = lastUpdateddate.toLocaleString('en-US', { month: 'long' });
      const year = lastUpdateddate.getFullYear();
      this.bankingUpdate = `${day} ${month} ${year}`;
    }
  }
  convertFileToBase64() {
    if (this.employeeBanking[this.employeeBanking.length - 1].file)
      this.downloadFile(this.employeeBanking[this.employeeBanking.length - 1].file, `${this.employeeProfile?.employeeDetails.name} ${this.employeeProfile?.employeeDetails.surname}_Proof_of_Account.pdf`);
  }

  downloadFile(base64String: string, fileName: string) {
    const decompressedFile = this.fileProcessingService.decompressFile(base64String);
    this.fileProcessingService.downloadFile(decompressedFile, fileName);
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
        var compressedFile = this.fileProcessingService.compressFile(base64String)
        this.employeeBankingsForm.patchValue({ 'file': compressedFile });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async editBankingDetails() {
    this.editBanking = true;
    this.employeeBankingsForm.enable();
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.employeeBankingsForm.controls), "EmployeeBanking", false , this.employeeBankingsForm , this.employeeProfile.employeeDetails.email!)
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
        employeeId: this.employeeProfile.employeeDetails.id,
        bankName: employeeBankingFormValue.bankName,
        branch: `${employeeBankingFormValue.branch}`,
        accountNo: `${employeeBankingFormValue.accountNo}`,
        accountType: employeeBankingFormValue.accountType,
        status: 1,
        declineReason: this.bankingReason,
        file: employeeBankingFormValue.file,
        lastUpdateDate: new Date().toISOString().slice(0, 10),
      }

      if (this.employeeBanking.find(x => x.status == 1)?.status == 1) {
        this.employeeBankingService.updatePending(this.employeeBankingDto).subscribe({
          next: (data) => {
            this.addOrUpdateBanking("Updated")
          }
        })
      }
      else {
        this.employeeBankingDto.id = 0;
        this.employeeBankingService.addBankingDetails(this.employeeBankingDto).subscribe({
          next: (data) => {
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
    this.hasUpdatedBanking = true;
    this.editBanking = false;
    this.employeeBankingsForm.disable();
    if (message = "Saved") {
      this.employeeBankingStarterkitService.incrementVolatileCount(this.employeeBankingDto.employeeId, true);
    }
  }

  totalBankingProgress() {
    if (this.employeeBanking.length > 0) {
      this.bankInformationProgress = Math.floor(this.bankingFormProgress);
      this.updateBanking.emit({ progress: this.bankInformationProgress, status: this.employeeBanking[this.employeeBanking.length - 1].status });
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
}
