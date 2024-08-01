import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CandidateService } from 'src/app/services/ats/candidate/candidate.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { schools } from 'src/app/models/ats/constants/schools.constants';
import { qualifications } from 'src/app/models/ats/constants/qualifications.constants';
import { GenericDropDownObject } from 'src/app/models/hris/generic-drop-down-object.interface';
import { Observable, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';

@Component({
  selector: 'app-new-candidate',
  templateUrl: './new-candidate.component.html',
  styleUrls: ['./new-candidate.component.css']
})
export class NewCandidateComponent {
  newCandidateForm!: FormGroup;
  searchControl: FormControl = new FormControl('');

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private candidateService: CandidateService,
    private router: Router,
    private snackBarService: SnackbarService,
    private navService: NavService,
    public employeeProfileService: EmployeeProfileService,
    private fb: FormBuilder
  ) { }

  levels: number[] = levels.map((level) => level.value);
  races: string[] = races.map((race) => race.value);
  schools: string[] = schools.map((school) => school.value);
  qualifications: string[] = qualifications.map((qualification) => qualification.value);
  years: number[] = [];
  imagePreview: string = '';
  previewImage: string = '';
  imageName: string = '';
  imageUrl: string = '';
  base64Image: string = "";
  cvFilename: string = "";
  portfolioFilename: string = "";
  cvUrl: string = '';
  portfolioUrl: string = '';
  emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  namePattern = /^[a-zA-Z\s'-]*$/;
  isMobileScreen = false;
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';
  isValidEmail = false;
  isValidCVFile = true;
  isValidCVFileSize = true;
  isValidPortfolioFileSize = true;
  isValidProfileImage = true;
  isValidPortfolioFile = true;
  isBlacklisted = false;
  candidateExists = false;
  candidateWarning = false;
  cvFileUploaded = false;
  portfolioFileUploaded = false;
  idPattern = /^\d{13}$/;
  optionIsOther = false;
  additionalFieldsVisible: boolean = false;
  currentChampionFilter: GenericDropDownObject = new GenericDropDownObject;
  employeesReferrals: Observable<GenericDropDownObject[]> = this.getEmployees();
  filteredEmployees!: Observable<GenericDropDownObject[]>;
  allEmployees: EmployeeProfile[] = [];
  optionValid: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
    this.navService.hideNav();
    this.populateYears();
    this.searchControl = new FormControl('');
    this.filteredEmployees = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterEmployees(value))
    );
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeProfileService.getEmployeeProfiles().subscribe({
      next: data => this.allEmployees = data,
      error: (er) => this.snackBarService.showError(er),
    })
  }

  initializeForm() {
    this.newCandidateForm = this.fb.group({
      name: new FormControl<string>('', [Validators.required, Validators.pattern(this.namePattern)]),
      surname: new FormControl<string>('', [Validators.required, Validators.pattern(this.namePattern)]),
      email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
      cellphoneNumber: new FormControl<string>('', [Validators.pattern(/^[0][6-8][0-9]{8}$/)]),
      potentialLevel: new FormControl<number>(-1, [Validators.pattern(/^[0-9]*$/), Validators.required]),
      jobPosition: new FormControl<number | null>(-1),
      location: new FormControl<string | null>(''),
      linkedInProfile: new FormControl<string>(''),
      cvFile: new FormControl<string>(''),
      portfolioLink: new FormControl<string>(''),
      portfolioFile: new FormControl<string>(''),
      gender: new FormControl<number>(0),
      idNumber: new FormControl<string>('', [Validators.pattern(this.idPattern)]),
      referral: new FormControl<number>(0),
      highestQualification: new FormControl<string>(''),
      school: new FormControl<string>(''),
      endDate: new FormControl<number>(0),
      race: new FormControl<number | null>(null),
      photo: new FormControl<string>(''),
    })
  }

  ngOnDestroy() {
    this.navService.showNav();
  }

  goToPreviousPage() {
    this.router.navigateByUrl('/ats-dashboard');
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    const earliestYear = 1970;
    for (let year = currentYear; year >= earliestYear; year--) {
      this.years.push(year);
    }
  }

  toggleOtherSchoolField(event: any, schools: any[]) {
    const selectedSchool = event.value;
    this.optionIsOther = selectedSchool === 'Other';
    if (!this.optionIsOther) {
      this.newCandidateForm.setValue({ selectedSchool: selectedSchool });
    }
  }
  onEmailChange(event: any): void {
    const emailChange = event.target.value;
    this.checkEmail(emailChange);
  }

  onImageChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.imageName = file.name;
      if (this.validateFile(file)) {
        this.imageConverter(file);
      } else {
        this.clearUpload();
      }
    }
  }

  validateFile(file: File): boolean {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (file.size > 4194304 || !allowedExtensions.includes(fileExtension || '')) {
      this.isValidProfileImage = false;
      return false;
    }
    this.isValidProfileImage = true;
    return true;
  }

  imageConverter(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      const base64Image = this.convertTobase64(this.imagePreview);
      this.newCandidateForm.patchValue({ 'photo': 'data:image/jpeg;base64,' + base64Image });
      this.getImageFromBase64(base64Image);
      this.base64Image = base64Image;
    };
    reader.readAsDataURL(file);
  }

  convertTobase64(dataURI: string): string {
    const base64index = dataURI.indexOf(';base64,') + ';base64,'.length;
    const base64 = dataURI.substring(base64index);
    return base64;
  }

  getImageFromBase64(base64Image: string) {
    const byteArray = atob(base64Image);
    const byteNumbers = new Array(byteArray.length);

    for (let i = 0; i < byteArray.length; i++) {
      byteNumbers[i] = byteArray.charCodeAt(i);
    }

    const byteArrayBuffer = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArrayBuffer], { type: 'image/jpeg' });
    this.imageUrl = URL.createObjectURL(blob);
  }

  toggleAdditionalFields(): void {
    this.additionalFieldsVisible = !this.additionalFieldsVisible;
  }

  getEmployees(): Observable<GenericDropDownObject[]> {
    return this.employeeProfileService.getEmployeeProfiles().pipe(
      map(employees => {
        const mappedEmployees: GenericDropDownObject[] = employees.map(employee => ({
          id: employee.id || 0,
          name: employee.name || 'Unknown',
          surname: employee.surname || 'unknown'
        }));
        mappedEmployees.unshift({});
        return mappedEmployees;
      })
    );
  }

  filterEmployees(value: string): Observable<GenericDropDownObject[]> {
    const searchValue = value;
    return this.employeesReferrals.pipe(
      map(employees => employees.filter(employee => employee.name?.toLowerCase().includes(searchValue)))
    );
  }

  validateAndCheckCandidateEmail(): void {
    const email = this.newCandidateForm.get('email')?.value as string;

    if (!email) {
      this.snackBarService.showSnackbar("Some Fields Are Still Missing Information", "snack-error");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isValidEmail = emailPattern.test(email);

    if (!this.isValidEmail) {
      this.snackBarService.showSnackbar("Please Enter a Valid Email Address", "snack-error");
      return;
    }
    this.checkEmail(email);
  }

  checkEmail(email: string) {
    this.candidateService.getAll().subscribe({
      next: (candidates) => {
        const candidate = candidates.find(c => c.personalEmail === email);
        if (candidate) {
          switch (candidate.blacklistedStatus) {
            case 0:
              this.candidateExists = true;
              break;
            case 1:
              this.candidateWarning = true;
              break;
            case 2:
              this.isBlacklisted = true;
              break;
            default:
              this.snackBarService.showSnackbar("Email Already Registered", "snack-info");
          }
        } else {
          this.candidateExists = false;
          this.candidateWarning = false;
          this.isBlacklisted = false;
        }
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }
  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
  }

  fileConverter(file: File, controlName: string) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const base64Data = reader.result as string;
      this.newCandidateForm.patchValue({ [controlName]: base64Data });
    });
    reader.readAsDataURL(file);
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  employeeProfile = {
    photo: 'assets/img/ProfileAts.png'
  };

  validateCVFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.isValidCVFile = false;
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.isValidCVFileSize = false;
      return false;
    }
    this.isValidCVFileSize = true;
    return true;
  }

  validatePortfolioFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (file.size > 10 * 1024 * 1024) {
      this.isValidPortfolioFileSize = false;
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      this.isValidPortfolioFile = false;
      return false;
    }
    this.isValidPortfolioFileSize = true;
    return true;
  }

  clearCVFileUpload() {
    this.cvFilename = '';
    this.isValidCVFile = true;
    this.cvFileUploaded = false;
    this.isValidCVFileSize = true;
    const uploadCVInputElement = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  clearPortfolioFileUpload() {
    this.portfolioFilename = '';
    this.isValidPortfolioFile = true;
    this.portfolioFileUploaded = false;
    this.isValidPortfolioFileSize = true;
    const uploadCVInputElement = document.getElementById('uploadPortfolioFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  onPortfolioFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.portfolioFileUploaded = true;
      const file = event.target.files[0];
      this.portfolioFilename = file.name;
      if (this.validatePortfolioFile(file)) {
        this.fileConverter(file, 'portfolio');
      }
    }
  }

  onCVFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.cvFileUploaded = true;
      const file = event.target.files[0];
      this.cvFilename = file.name;
      if (this.validateCVFile(file)) {
        this.fileConverter(file, 'cv');
      }
    }
  }

  saveCandidateAndExit() {
    this.onSubmitCandidate('/ats-dashboard');
  }

  saveAndAddAnotherCandidate() {
    if (this.newCandidateForm.valid) {
      this.onSubmitCandidate('/create-candidate');
      this.newCandidateForm.reset();
      this.clearSpecificFields();
      this.clearValidators();
    } else {
      this.newCandidateForm.markAllAsTouched();
    }
  }

  clearSpecificFields() {
    this.searchControl.setValue('');
    this.cvFilename = '';
    this.cvFileUploaded = false;
    this.isValidCVFile = true;
    this.isValidCVFileSize = true;
    this.portfolioFilename = '';
    this.portfolioFileUploaded = false;
    this.isValidPortfolioFile = true;
    this.isValidPortfolioFileSize = true;
    this.isValidProfileImage = false;
    this.imageUrl = '';
  }

  clearValidators() {
    for (const controlName in this.newCandidateForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.newCandidateForm.controls, controlName)) {
        const control = this.newCandidateForm.get(controlName);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    }
  }

  onSubmitCandidate(nextPage: string): void {
    if (this.newCandidateForm.valid) {
      const newCandidateForm = this.newCandidateForm.value;

      const candidateDto = {
        id: 0,
        name: newCandidateForm.name,
        surname: newCandidateForm.surname,
        personalEmail: newCandidateForm.email,
        potentialLevel: newCandidateForm.potentialLevel,
        jobPosition: newCandidateForm.jobPosition,
        linkedIn: newCandidateForm.linkedInProfile,
        profilePicture: this.base64Image,
        cellphoneNumber: newCandidateForm.cellphoneNumber,
        location: newCandidateForm.location,
        cv: this.cvFilename,
        portfolioLink: newCandidateForm.portfolioLink,
        portfolioPdf: this.portfolioFilename,
        gender: newCandidateForm.gender,
        race: newCandidateForm.race,
        idNumber: newCandidateForm.idNumber,
        referral: newCandidateForm.referral,
        highestQualification: newCandidateForm.highestQualification,
        school: newCandidateForm.school,
        qualificationEndDate: newCandidateForm.endDate,
        blacklistedStatus: 0,
        blacklistedReason: ''
      }
      this.candidateService.addCandidate(candidateDto).subscribe({
        next: (data) =>
          this.snackBarService.showSnackbar("Added", "snack-success"),
        error: (er) => this.snackBarService.showError(er),
        complete: () => {
          this.router.navigateByUrl(nextPage);
        }
      })
    }
  }

  showSelectedReferral(event: any) {
    this.allEmployees.forEach(employee => {
      let fullName = `${employee.name} ${employee.surname}`;
      if (fullName == event.source.value) {
        this.newCandidateForm.get('referral')?.patchValue(employee.id)
      }
    })
  }

  checkSelectedOption(option: any) {
    if (option == 0 || option.value == 0)
      this.optionValid = true;
    else
      this.optionValid = false;
  }
}
