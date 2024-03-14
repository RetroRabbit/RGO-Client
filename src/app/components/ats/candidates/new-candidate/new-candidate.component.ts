import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CandidateService } from 'src/app/services/ats/candidate/candidate.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { candidateDocument } from 'src/app/models/ats/candidateDocument.interface';
import { schools } from 'src/app/models/ats/schools.constants';
import { qualifications } from 'src/app/models/ats/qualifications.constants';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { GenericDropDownObject } from 'src/app/models/hris/generic-drop-down-object.interface';
import { Observable, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-candidate',
  templateUrl: './new-candidate.component.html',
  styleUrls: ['./new-candidate.component.css']
})
export class NewCandidateComponent {
  newEmployeeForm: any;
  searchControl: FormControl = new FormControl('');

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
    private navService: NavService,
    public employeeService: EmployeeService
  ) { }

  levels: number[] = levels.map((level) => level.value);
  races: string[] = races.map((race) => race.value);
  schools: string[] = schools.map((school) => school.value);
  qualifications: string[] = qualifications.map((qualification) => qualification.value);
  years: number[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  imageName: string = "";
  cvFilename: string = "";
  portfolioFilename: string = "";
  cvUrl: string = '';
  portfolioUrl: string = '';
  emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  namePattern = /^[a-zA-Z\s'-]*$/;
  linkedInPattern = '^https?://(?:www\\.)?linkedin\\.com/in/[a-zA-Z0-9-]+$';
  isMobileScreen = false;
  screenWidth = window.innerWidth;
  candidateDocumentModels: candidateDocument[] = [];
  PREVIOUS_PAGE = 'previousPage';
  websiteLinkPattern = '^(https?://)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(\\S*)?$';
  isValidEmail = false;
  isValidCVFile = true;
  isValidPortfolioFile = true;
  IdPattern = /^\d{13}$/;
  optionIsOther = false;
  additionalFieldsVisible: boolean = false;
  currentChampionFilter: GenericDropDownObject = new GenericDropDownObject;
  employeesReferrals: Observable<GenericDropDownObject[]> = this.getEmployees();
  filteredEmployees!: Observable<GenericDropDownObject[]>;


  newcandidateForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.pattern(this.namePattern)]),
    surname: new FormControl<string>('', [Validators.required, Validators.pattern(this.namePattern)]),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    contactNumber: new FormControl<string>('', Validators.pattern(/^[0-9]*$/)),
    potentialLevel: new FormControl<number>(-1, [Validators.pattern(/^[0-9]*$/), Validators.required]),
    role: new FormControl<string>(''),
    location: new FormControl<string | null>(''),
    linkedInProfile: new FormControl<string>('', [Validators.pattern(this.linkedInPattern), Validators.required]),
    cvFile: new FormControl<string>(''),
    portfolioLink: new FormControl<string>('', [Validators.pattern(this.websiteLinkPattern), Validators.required]),
    portfolioFile: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    idNumber: new FormControl<string>('', [Validators.pattern(this.IdPattern), Validators.required]),
    referral: new FormControl<string>(''),
    highestQualification: new FormControl<string>(''),
    school: new FormControl<string>(''),
    fieldOfStudy: new FormControl<string>(''),
    startDate: new FormControl<string>(''),
    endDate: new FormControl<string>(''),
    race: new FormControl<string>(''),
    photo: new FormControl<string>(''),
  }
  )

  ngOnInit(): void {
    this.navService.showNavbar = false;
    this.populateYears();
    this.searchControl = new FormControl('');
    this.filteredEmployees = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterEmployees(value))
    );
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
  }


  onSubmit(reset: boolean = false): void {
  }

  goToPreviousPage() {
    this.router.navigateByUrl(this.cookieService.get(this.PREVIOUS_PAGE));
  }

  setSelectedRace(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({ race: +selectedValue });
  }

  setSelectedGender(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({ gender: +selectedValue });
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    const earliestYear = 1970;
    for (let year = currentYear; year >= earliestYear; year--) {
      this.years.push(year);
    }
  }

  toggleOtherSchoolField(event: any) {
    this.optionIsOther = event.value === 'Other';
    if (!this.optionIsOther) {
      this.newcandidateForm.controls.school.setValue('');
      this.optionIsOther = true;
    }
  }

  validateFile(file: File): boolean {
    if (file.size > 4194304) {
      return false;
    }
    return true;
  }

  toggleAdditionalFields(): void {
    this.additionalFieldsVisible = !this.additionalFieldsVisible;
  }

  getEmployees(): Observable<GenericDropDownObject[]> {
    return this.employeeService.getAll().pipe(
      map(employees => {
        const mappedEmployees: GenericDropDownObject[] = employees.map(employee => ({
          id: employee.id || 0,
          name: employee.name || 'Unknown'
        }));
        mappedEmployees.unshift({ id: 0, name: 'All' });
        return mappedEmployees;
      })
    );
  }

  filterEmployees(value: string): Observable<GenericDropDownObject[]> {
    const searchValue = value.toLowerCase();
    return this.employeesReferrals.pipe(
      map(employees => employees.filter(employee => employee.name?.toLowerCase().includes(searchValue)))
    );
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
      const base64Image = reader.result as string;
      this.imagePreview = base64Image;
      this.newEmployeeForm.patchValue({ 'photo': base64Image });
      this.getImageFromBase64(base64Image);
    });
    reader.readAsDataURL(file);
  }


  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
  }

  fileConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const base64CV = reader.result as string;
      this.newEmployeeForm.patchValue({ 'cv': base64CV });
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

  validateCVFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (file.size > 4194304 || !allowedTypes.includes(file.type)) {
      this.isValidCVFile = false;
      this.snackBarService.showSnackbar("File Type or size invalid", "snack-error");
      return false;
    } else {
      return true;
    }
  }

  validatePortfolioFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (file.size > 4194304 || !allowedTypes.includes(file.type)) {
      this.snackBarService.showSnackbar("File Type or size invalid", "snack-error");
      this.isValidPortfolioFile = false;
      return false;
    } else {
      return true;
    }
  }

  clearCVFileUpload() {
    this.cvFilename = '';
    this.isValidCVFile = true;
    const uploadCVInputElement = document.getElementById('uploadCVFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  clearPortfolioFileUpload() {
    this.portfolioFilename = '';
    this.isValidPortfolioFile = true;
    const uploadCVInputElement = document.getElementById('uploadPortfolioFile') as HTMLInputElement;
    if (uploadCVInputElement) {
      uploadCVInputElement.value = '';
    }
  }

  onPortfolioFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.portfolioFilename = file.name;
      if (this.validatePortfolioFile(file)) {
        this.fileConverter(file);
      }
    }
  }

  onCVFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.cvFilename = file.name;
      if (this.validateCVFile(file)) {
        this.fileConverter(file);
      }
    }
  }
}


