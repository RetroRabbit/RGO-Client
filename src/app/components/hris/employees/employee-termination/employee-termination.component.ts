import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { terminationOptions } from 'src/app/models/hris/constants/terminationOptions.constants';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

@Component({
  selector: 'app-employee-termination',
  templateUrl: './employee-termination.component.html',
  styleUrls: ['./employee-termination.component.css']
})
export class EmployeeTerminationComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  newterminationform!: FormGroup;
  terminationOption: string[] = terminationOptions.map((termination) => termination.value);
  isMobileScreen = false;
  fileUploaded: boolean = false;
  selectedFile !: File;
  screenWidth = window.innerWidth;
  interviewFilename: string = "";
  interviewFileUploaded: boolean = false;
  isvalidFile: boolean = false;
  isvalidFileSize: boolean = false;
  base64String: string = "";

  constructor(
    private navService: NavService,
    private fb: FormBuilder,
    private router: Router,
    private snackBarService : SnackbarService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.navService.hideNav();
  }
  
  ngOnDestroy() {
    this.navService.showNav();
  }

  initializeForm() {
    this.newterminationform = this.fb.group({
      terminationOption: new FormControl('', Validators.required),
      dateOfNotice: new FormControl<Date | null>(null, Validators.required),
      lastDayOfEmployment: new FormControl<Date | null>(null, Validators.required),
      reEmployment: new FormControl<boolean>(false, Validators.required),
      companyEquipement: new FormControl<boolean>(false, Validators.required),
      companyAccounts: new FormControl<boolean>(false, Validators.required),
      exitInterviewDoc: new FormControl<boolean>(false, Validators.required),
      additionalComments: new FormControl<string>(''),
    });
  }
  

  removeDocument() {
    this.interviewFilename = '';
    const uploadedDoc = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadedDoc) {
      uploadedDoc.value = '';
    }
    this.snackBarService.showSnackbar('File removed succesfully','snack-success');
  }
  onCVFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.interviewFileUploaded = true;
      const file = event.target.files[0];
      this.interviewFilename = file.name;
      if (this.validateCVFile(file)) {
        this.fileConverter(file, 'exitInterviewDoc');
      }
    }
  }

  fileConverter(file: File, controlName: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const base64Data = reader.result as string;
      this.newterminationform.patchValue({ [controlName]: base64Data });
      this.snackBarService.showSnackbar('File uploaded succesfully','snack-success');
    });
    reader.readAsDataURL(file);
  }

  validateCVFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.isvalidFile = false;
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.isvalidFileSize = false;
      return false;
    }
    this.isvalidFileSize = true;
    return true;
  }

  goToPreviousPage() {
    this.router.navigateByUrl('/profile');
    this.navService.showNav();
  }

  saveTermination() {
    // Save termination logic
  }

}
