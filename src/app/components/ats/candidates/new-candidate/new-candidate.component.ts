import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CandidateService } from 'src/app/services/ats/candidate/candidate.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';

@Component({
  selector: 'app-new-candidate',
  templateUrl: './new-candidate.component.html',
  styleUrls: ['./new-candidate.component.css']
})
export class NewCandidateComponent {
  newEmployeeForm: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private candidateService: CandidateService,
    private cookieService: CookieService,
    private router: Router,
    private snackBarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private navService: NavService
  ) { }

  levels: number[] = levels.map((level) => level.value);
  races: string[] = races.map((race) => race.value);
  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  imageName: string = "";
  emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  namePattern = /^[a-zA-Z\s'-]*$/;
  isMobileScreen = false;
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';
  isValidEmail=false;
  additionalFieldsVisible: boolean = false;

  newcandidateForm = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.pattern(this.namePattern)]), 
      surname: new FormControl<string>('', [Validators.required,Validators.pattern(this.namePattern)]),
      email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
      contactNumber: new FormControl<string>('', Validators.pattern(/^[0-9]*$/)),
      potentialLevel: new FormControl<number>(-1, [Validators.pattern(/^[0-9]*$/), Validators.required]),
      role: new FormControl<string >(''),
      location: new FormControl<string | null>(''),
      linkedInProfile: new FormControl<string>(''),
      cvFile: new FormControl<string>(''),
      portfolioLink: new FormControl<string>(''),
      portfolioFile: new FormControl<string>(''),
      gender: new FormControl<string >(''),
      idNumber: new FormControl<string >(''),
      referral: new FormControl<string >(''),
      highestQualification: new FormControl<string >(''),
      school: new FormControl<string >(''),
      fieldOfStudy: new FormControl<string >(''),
      startDate: new FormControl<string >(''),
      endDate: new FormControl<string >(''),
      race: new FormControl<string >(''),
    }
  )

  ngOnInit(): void {
    this.navService.showNavbar = false;
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
  }


  onSubmit(reset: boolean = false): void {
  }

  goToPreviousPage() {
    this.router.navigateByUrl(this.cookieService.get(this.PREVIOUS_PAGE));
  }

  validateFile(file: File): boolean {
    if (file.size > 4194304) {
      return false;
    }
    return true;
  }

  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
  }

  toggleAdditionalFields(): void {
    this.additionalFieldsVisible = !this.additionalFieldsVisible; // Toggle the boolean value
}

  checkEmailValidity(): void {
    const email = this.newcandidateForm.controls.email.value;
    if (email !== null) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.isValidEmail = emailPattern.test(email);
        
        if (!this.isValidEmail) {
            this.snackBarService.showSnackbar("Please enter a valid email address", "snack-error");
        }
    } else {
        this.snackBarService.showSnackbar("Please enter an email address", "snack-error");
    }
}

  imageConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.imagePreview = reader.result as string;
      const base64Image = this.convertTobase64(this.imagePreview);
      this.newEmployeeForm.patchValue({ 'photo': 'data:image/jpeg;base64,' + base64Image });
      this.getImageFromBase64(base64Image);
    });

    reader.readAsDataURL(file);
  }
  convertTobase64(imagePreview: string) {
    throw new Error('Method not implemented.');
  }
  getImageFromBase64(base64Image: any) {
    throw new Error('Method not implemented.');
  }

  employeeProfile = {
    photo: 'assets/img/ProfileAts.png' 
  };
  
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employeeProfile.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
