import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { terminationOptions } from 'src/app/models/hris/constants/terminationOptions.constants';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

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
  selectedFile !: File;
  screenWidth = window.innerWidth;
  interviewFilename: string = "";

  constructor(
    private navService: NavService,
    private fb: FormBuilder,
    private router: Router,
    private snackBarService : SnackbarService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.navService.hideNav();
  }

  initializeForm() {
    this.newterminationform = this.fb.group({
      terminationOption: new FormControl('', Validators.required),
      dateOfNotice: new FormControl<Date | null>(null, Validators.required),
      lastDayOfEmployment: new FormControl<Date | null>(null, Validators.required),
      reEmployment: new FormControl<boolean>(true, Validators.required),
      offBoardingTasks: new FormControl<boolean>(false, Validators.required),
      exitInterviewDoc: new FormControl<boolean>(false, Validators.required),
      additionalComments: new FormControl<string>(''),
    });
  }
  

  removeDocument() {
    this.interviewFilename = '';
    const uploadCVInputElement = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  onFileChange(){

  }

  uploadDocument(event: any) {
    
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
