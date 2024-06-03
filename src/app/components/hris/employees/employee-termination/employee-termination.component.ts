import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { terminationOptions } from 'src/app/models/hris/constants/terminationOptions.constants';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-termination',
  templateUrl: './employee-termination.component.html',
  styleUrls: ['./employee-termination.component.css']
})
export class EmployeeTerminationComponent implements OnInit {
  newterminationform!: FormGroup;
  terminationOption: string[] = terminationOptions.map((termination) => termination.value);
  isMobileScreen = false;
  screenWidth = window.innerWidth;
  interviewFilename: string = "";

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private navService: NavService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.navService.hideNav();
  }

  initializeForm() {
    this.newterminationform = this.fb.group({
      terminationOption: new FormControl(''),
      dateOfNotice: new FormControl<Date | null>(null),
      lastDayOfEmployment: new FormControl<Date | null>(null),
      // reEmployment: new FormControl<boolean>(true),
      // offBoardingTasks: new FormControl<boolean>(false),
      // exitInterviewDoc: new FormControl<boolean>(false),
      additionalComments: new FormControl<string>(''),
    });
  }

  disableDownload(){

  }

  downloadDocument() {

  }

  removeDocument() {
    this.interviewFilename = '';
    const uploadCVInputElement = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  uploadDocument(event: any) {
    // this.isLoadingUpload = true;
    // this.selectedFile = event.target.files[0];
    // this.documentsFileName = this.selectedFile.name;
    // if (this.allowedTypes.includes(this.selectedFile.type)) {
    //   this.uploadProfileDocument();
    // } else {
    //   this.snackBarService.showSnackbar("Please upload a PDF", "snack-error");
    //   this.isLoadingUpload = false;
    // }
  }

  goToPreviousPage() {
    this.router.navigateByUrl('/profile');
    this.navService.showNav();
  }

  saveTermination() {
    // Save termination logic
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Handle file upload
    }
  }
}
