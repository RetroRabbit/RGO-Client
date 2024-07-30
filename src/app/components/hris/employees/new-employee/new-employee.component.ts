import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { combineLatest, first } from 'rxjs';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { MatStepper } from '@angular/material/stepper';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/services/hris/id-validator.service';
import { LocationApiService } from 'src/app/services/hris/location-api.service';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input-v16';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})

export class NewEmployeeComponent implements OnInit {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeTypeService: EmployeeTypeService,
    private employeeAddressService: EmployeeAddressService,
    private cookieService: CookieService,
    private router: Router,
    private customValidationService: CustomvalidationService,
    private employeeDocumentService: EmployeeDocumentService,
    private snackBarService: SnackbarService,
    public navService: NavService,
    public locationApiService: LocationApiService,
  ) {
    this.navService.hideNav();
  }
  @ViewChild('stepper') private myStepper!: MatStepper;
  @ViewChild('inputField') inputField!: NgxMatIntlTelInputComponent;

  employeeTypes: EmployeeType[] = [];
  employeeDocumentModels: EmployeeDocument[] = [];
  Employees: EmployeeProfile[] = [];
  files: NgxFileDropEntry[] = [];
  filteredPeopleChamps: any = [];
  levels: number[] = levels.map((level) => level.value);
  races: string[] = races.map((race) => race.value);
  genders: string[] = genders.map((gender) => gender.value);
  provinces: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  newEmployeeEmail = "";
  base64String = "";
  filename = "";
  imageName: string = "";
  imagePreview: string = '';
  imageUrl: string = '';
  countrySelected: string = '';
  peopleChampionId = null;
  empId: number = 0;
  employeeDetails: any;
  PREVIOUS_PAGE = 'previousPage';
  COMPANY_EMAIL = 'retrorabbit.co.za';
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  namePattern = /^[a-zA-Z\s ()'-]*$/;
  initialsPattern = /^[A-Za-z]+$/;
  toggleAdditional: boolean = false;
  validImage: boolean = false;
  isMobileScreen: boolean = false;
  isLoadingAddEmployee: boolean = false;
  isSameAddress: boolean = true;
  existingIdNumber: boolean = false;
  isValidStarterkitFile: boolean = false;
  typeOther: boolean = false;
  hasDisability: boolean = false;
  isLinear: boolean = true;
  isDirty: boolean = false;
  disabilityType = disabilities;

  categories: { [key: number]: { name: string, state: boolean } } = {
    0: { name: '', state: true },
    1: { name: '', state: true },
    2: { name: '', state: true },
    3: { name: '', state: true },
  };

  physicalAddress: FormGroup = this.createAddressForm();
  postalAddress: FormGroup = this.createAddressForm();
  newEmployeeForm: FormGroup = this.createEmployeeForm();

  settingsForm: FormGroup = new FormGroup({
    toggleAdditionalFields: new FormControl<boolean>(
      false,
      Validators.required
    ),
  });

  postalAddressForm: FormGroup = new FormGroup({
    sameAsPhysicalAddress: new FormControl<boolean>(true, Validators.required),
  });

  uploadDocumentForm = new FormGroup({
    id: new FormControl<number>(0),
    employee: new FormControl<EmployeeProfile | null>(null),
    fileName: new FormControl<string>(''),
    file: new FormControl<string>(''),
    uploadDate: new FormControl<Date | string>(new Date(Date.now())),
  });

  onCellphoneInputCheck(value: string): void {
    const container = document.querySelector('.cellphone-container');
    if (value) {
      container?.classList.add('has-value');
    } else {
      container?.classList.remove('has-value');
    }
  }

  ngOnInit(): void {
    this.loadCountries();
    this.initializeForm();
  }

  ngOnDestroy() {
    this.navService.showNav();
  }

  loadCountries(): void {
    this.locationApiService.getCountries().subscribe({
      next: (data) => this.countries = data
    });
  }

  initializeForm() {
    this.newEmployeeForm.get('disability')?.valueChanges.subscribe(value => {
      const disabilityNotesControl = this.newEmployeeForm.get('disabilityType');
      if (value === true) {
        disabilityNotesControl?.setValidators([Validators.required]);
      } else {
        disabilityNotesControl?.clearValidators();
      }
      disabilityNotesControl?.updateValueAndValidity();
    });

    this.newEmployeeForm.get('disabilityTpe')?.valueChanges.subscribe(value => {
      const disabilityNotesControl = this.newEmployeeForm.get('disabilityNotes');
      if (value == 'Other') {
        disabilityNotesControl?.setValidators([Validators.required]);
      } else {
        disabilityNotesControl?.clearValidators();
      }
      disabilityNotesControl?.updateValueAndValidity();
    });

    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.employeeTypes = data.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      },
    });

    this.employeeProfileService
      .getEmployeeProfiles()
      .subscribe((data: EmployeeProfile[]) => {
        this.Employees = data;
      });
  }

  saveAndExit() {
    this.isLoadingAddEmployee = true;
    this.saveEmployee("SaveAndExit");
    this.clearFormErrorsAndValues(this.newEmployeeForm);
    this.clearFormErrorsAndValues(this.uploadDocumentForm);
    this.clearFormErrorsAndValues(this.physicalAddress);
    this.clearFormErrorsAndValues(this.postalAddressForm);
    this.removeAllDocuments();
  }

  saveAndAddAnother() {
    this.isLoadingAddEmployee = true;
    this.saveEmployee("SaveAndAddAnother");
    this.newEmployeeForm.reset();
    this.clearFormErrorsAndValues(this.newEmployeeForm);
    this.clearFormErrorsAndValues(this.uploadDocumentForm);
    this.clearFormErrorsAndValues(this.physicalAddress);
    this.clearFormErrorsAndValues(this.postalAddressForm);
    this.removeAllDocuments();
    this.newEmployeeForm.controls['engagementDate'].setValue(new Date(Date.now()));
    this.newEmployeeForm.controls['disability'].setValue(false);
    this.myStepper.reset();
    this.newEmployeeForm.get('cellphoneNo')?.reset();
    this.newEmployeeForm.markAsUntouched()
  }

  saveEmployee(saveType: string): void {
    var documents = this.employeeDocumentModels;
    this.employeeProfileService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Employee Saved", "snack-success");
        this.isDirty = false;
        this.newEmployeeForm.reset();
        this.employeeProfileService.getEmployeeProfileByEmail(this.newEmployeeEmail).subscribe({
          next: employeeProfile => {
            documents.forEach(element => {
              element.employeeId = employeeProfile.id as number;
            });
            this.employeeDocumentModels = documents;
          },
          error: er => {
            this.snackBarService.showError(er);
          },
          complete: () => {
            if (saveType == "SaveAndExit") {
              this.onUploadDocument(this.cookieService.get(this.PREVIOUS_PAGE));
            }
            else {
              this.onUploadDocument('/create-employee');
            }
          }
        })
      },
      error: () => {
        this.snackBarService.showSnackbar(`Some Fields Are Still Missing Information`, "snack-error");
        this.isDirty = false;
      },
    });
  }

  onUploadDocument(nextPage: string): void {
    var documents = this.employeeDocumentModels
    
    if(documents.length > 0){
      documents.forEach((documentModel) => {
        this.employeeDocumentService.saveEmployeeDocument(documentModel, 0).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Employee Documents Saved", "snack-success");
            this.isLoadingAddEmployee = false;
            this.inputField.reset();
            document.querySelector('.cellphone-container')?.classList.remove('has-value');
          },
          error: (er: any) => {
            this.snackBarService.showError(er);
            this.isLoadingAddEmployee = false;
          }, complete: () => {
            this.employeeDocumentModels = [];
            this.newEmployeeEmail = "";
            this.files = [];
            this.myStepper.previous();
            this.router.navigateByUrl(nextPage);
            this.isLoadingAddEmployee = false;
          }
        });
      });
    }
    else{
      this.isLoadingAddEmployee = false;
      this.inputField.reset();
      document.querySelector('.cellphone-container')?.classList.remove('has-value');
    }
  }

  onCountryChange(country: string): void {
    this.countrySelected = country;
    this.provinces = [];
    this.cities = [];
    this.loadProvinces(this.countrySelected);
  }

  loadProvinces(country: string): void {
    this.locationApiService.getProvinces(country).subscribe({
      next: (data) => this.provinces = data
    });
    this.cities = [];
  }

  loadCities(province: string): void {
    this.locationApiService.getCities(this.countrySelected, province).subscribe({
      next: (data) => this.cities = data,
      error: (er) => this.snackBarService.showError(er),
    });
  }

  filterChampions(event: any) {
    if (event) {
      this.filteredPeopleChamps = this.Employees.filter((champs: EmployeeProfile) =>
        champs.employeeType?.id == 7 && champs.name?.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      this.filteredPeopleChamps = this.Employees;
    }
  }

  getId(data: any, name: string) {
    if (name == 'champion') {
      this.peopleChampionId = data.id;
    }
  }

  public dropped(files: NgxFileDropEntry[], category: number) {
    this.files.push(...files);
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const allowedTypes = ['application/pdf'];
          if (!allowedTypes.includes(file.type)) {
            this.isValidStarterkitFile = false;
            this.snackBarService.showSnackbar("Please Upload a PDF", "snack-error");
            return;
          }
          this.isValidStarterkitFile = true;
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            const employeeDocument: EmployeeDocument = {
              id: 0,
              employeeId: -1,
              reference: "",
              fileName: file.name,
              fileCategory: category,
              employeeFileCategory: 0,
              adminFileCategory: 0,
              blob: base64String,
              uploadDate: new Date(),
              reason: "",
              status: 3,
              counterSign: false,
              documentType: 1,
              lastUpdatedDate: new Date()
            };
            this.employeeDocumentModels.push(employeeDocument);
            this.categories[category].state = false;
            this.categories[category].name = file.name;
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  clearFormErrorsAndValues(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control instanceof FormControl) {
        control.clearValidators();
      } else if (control instanceof FormGroup) {
        this.clearFormErrorsAndValues(control);
      }
    });
  }

  public fileOver(event: Event) {
  }
  public fileLeave(event: Event) {
  }

  public removeFileByIndex(index: number): void {
    if (index >= 0 && index < this.files.length) {
      this.files.splice(index, 1);
    }
  }

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

  postalSameAsPhysicalAddress(event: boolean) {
    this.isSameAddress = event;

    if (this.postalAddressForm.value.sameAsPhysicalAddress && event) {
      this.postalAddress.patchValue({
        unitNumber: this.physicalAddress.value.unitNumber,
        complexName: this.physicalAddress.value.complexName,
        suburbDistrict: this.physicalAddress.value.suburbDistrict,
        city: this.physicalAddress.value.city,
        streetNumber: this.physicalAddress.value.streetNumber,
        streetName: this.physicalAddress.value.streetName,
        country: this.physicalAddress.value.country,
        province: this.physicalAddress.value.province,
        postalCode: this.physicalAddress.value.postalCode,
      });
    }
  }

  get physicalAddressObj(): EmployeeAddress {
    return {
      id: 0,
      unitNumber: this.physicalAddress.value.unitNumber!,
      complexName: this.physicalAddress.value.complexName!,
      suburbOrDistrict: this.physicalAddress.value.suburbDistrict!,
      city: this.physicalAddress.value.city!,
      streetNumber: this.physicalAddress.value.streetNumber!,
      streetName: this.physicalAddress.value.streetName!,
      country: this.physicalAddress.value.country!,
      province: this.physicalAddress.value.province!,
      postalCode: this.physicalAddress.value.postalCode!,
    };
  }

  get postalAddressObj(): EmployeeAddress {
    return {
      id: 0,
      unitNumber: this.postalAddress.value.unitNumber!,
      complexName: this.postalAddress.value.complexName!,
      suburbOrDistrict: this.postalAddress.value.suburbDistrict!,
      city: this.postalAddress.value.city!,
      streetNumber: this.postalAddress.value.streetNumber!,
      streetName: this.postalAddress.value.streetName!,
      country: this.postalAddress.value.country!,
      province: this.postalAddress.value.province!,
      postalCode: this.postalAddress.value.postalCode!,
    };
  }

  saveAddress(): void {
    combineLatest([
      this.employeeAddressService.save(this.physicalAddressObj),
      this.employeeAddressService.save(this.postalAddressObj)
    ]).pipe(first()).subscribe()
  }

  onSubmit(reset: boolean = false): void {
    this.existingIdNumber = false;
    if (!this.newEmployeeForm.controls['idNumber'].valid) {
      this.snackBarService.showSnackbar("Valid ID Number Required", "snack-error");
      return;
    }
    if (this.isDirty == true)
      return;
    if (this.newEmployeeForm.value.email !== null && this.newEmployeeForm.value.email !== undefined && this.newEmployeeForm.value.email.endsWith(this.COMPANY_EMAIL)) {
      this.newEmployeeEmail = this.newEmployeeForm.value.email;
    } else {
      this.snackBarService.showSnackbar("Retro Rabbit Email Address Required", "snack-error");
      return;
    }
    if (this.newEmployeeForm.value.disability !== null && this.newEmployeeForm.value.disability !== undefined) {
      this.newEmployeeForm.value.disability;
    } else {
      this.snackBarService.showSnackbar("Specify Disability Status", "snack-error");
      return;
    }
    if (this.newEmployeeForm.value.cellphoneNo == null || !this.newEmployeeForm.controls['cellphoneNo'].valid) {
      this.snackBarService.showSnackbar("Valid cellphone number required", "snack-error");
      return;
    }
    this.newEmployeeForm.patchValue({ id: 0 });
    this.newEmployeeForm.value.initials = this.newEmployeeForm.value.initials?.toUpperCase();
    this.newEmployeeForm.value.cellphoneNo =
      this.newEmployeeForm.value.cellphoneNo?.toString().trim();
    this.newEmployeeForm.patchValue({
      employeeNumber: this.newEmployeeForm.value.surname?.substring(0, 3).toUpperCase() + '000',
      engagementDate: new Date(
        new Date(this.newEmployeeForm.value.engagementDate!)
          .setUTCHours(0, 0, 0, 0)
        + (
          new Date(this.newEmployeeForm.value.engagementDate!).toDateString() ===
            new Date().toDateString()
            ? 0
            : 24 * 60 * 60 * 1000
        )
      ).toISOString()
      ,
      dateOfBirth: this.newEmployeeForm.value.dateOfBirth,
      physicalAddress: this.physicalAddressObj,
      postalAddress: this.postalAddressObj,
      peopleChampion: this.newEmployeeForm.controls["peopleChampion"].value == "" ? null : this.peopleChampionId
    });

    const employeeEmail: string = this.newEmployeeForm.value.email!;
    this.checkBlankRequiredFields();
    this.employeeProfileService.checkDuplicateIdNumber(this.newEmployeeForm.value.idNumber as string, 0).subscribe({
      next: (data: boolean) => {
        this.existingIdNumber = data;
        if (this.existingIdNumber) {
          this.snackBarService.showSnackbar("ID Number Already Exists", "snack-error");
        } else {
          this.nextStep();
        }
      },
      error: (er) => {
        this.snackBarService.showError(er);
      }
    });
  }

  nextStep() {
    if (this.newEmployeeForm.invalid) {
      this.newEmployeeForm.markAllAsTouched();
    }
    if (this.typeOther == false) {
      this.newEmployeeForm.value.disabilityNotes = this.newEmployeeForm.value.disabilityType;
    }
    else {
      this.newEmployeeForm.value.disabilityNotes = this.newEmployeeForm.value.disabilityNotes;
    }

    this.employeeDetails = this.newEmployeeForm.value;
    this.myStepper.next();
  }

  checkBlankRequiredFields() {
    this.newEmployeeForm.value.dateOfBirth = this.newEmployeeForm.value
      .dateOfBirth
      ? this.newEmployeeForm.value.dateOfBirth
      : new Date(Date.now());
    this.newEmployeeForm.value.countryOfBirth =
      this.newEmployeeForm.value.countryOfBirth === ''
        ? 'TBA'
        : this.newEmployeeForm.value.countryOfBirth?.trim();
    this.newEmployeeForm.value.nationality =
      this.newEmployeeForm.value.nationality === ''
        ? 'TBA'
        : this.newEmployeeForm.value.nationality?.trim();
    this.newEmployeeForm.value.employeeNumber =
      this.newEmployeeForm.value.employeeNumber === ''
        ? 'TBA'
        : this.newEmployeeForm.value.employeeNumber?.toString().trim();
    this.newEmployeeForm.value.taxNumber =
      this.newEmployeeForm.value.taxNumber === ''
        ? 'TBA'
        : this.newEmployeeForm.value.taxNumber?.toString().trim();
    this.newEmployeeForm.value.idNumber =
      this.newEmployeeForm.value.idNumber === '0'
        ? 'TBA'
        : this.newEmployeeForm.value.idNumber?.toString().trim();
    this.newEmployeeForm.value.photo =
      this.newEmployeeForm.value.photo === ''
        ? ''
        : this.newEmployeeForm.value.photo?.trim();
  }

  imageHandler(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      if (this.validateFile(file)) {
        this.imageConverter(file);
        this.validImage = true;
      } else {
        this.clearUpload();
        this.validImage = false;
      }
    } else {
      this.validImage = false;
    }
  }

  validateFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeInBytes = 4194304;

    if (!validTypes.includes(file.type)) {
      this.snackBarService.showSnackbar(`Only JPEG, JPG, and PNG Files Are Allowed!`, "snack-error");
      return false;
    }

    if (file.size > maxSizeInBytes) {
      this.snackBarService.showSnackbar(`File Size Must Be Less Than 4mb!`, "snack-error");
      return false;
    }

    return true;
  }

  clearUpload(): void {
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
    this.imageName = '';
    this.imagePreview = '';
    this.newEmployeeForm.patchValue({ 'photo': null });
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

  setSelectedRace(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({ race: +selectedValue });
  }

  setSelectedGender(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({ gender: +selectedValue });
  }

  goToPreviousPage() {
    this.router.navigateByUrl(this.cookieService.get(this.PREVIOUS_PAGE));
  }

  getGenderBirthday(event: FocusEvent) {
    let idNo = (event.target as HTMLInputElement).value;
    let dob = idNo.slice(0, 6);
    let gender = parseInt(idNo.slice(6, 10));
    let dobMatch = dob.match(/\d{2}/g);

    if (dobMatch) {
      let [year, month, day] = dobMatch;
      const currentYear = new Date().getFullYear().toString().slice(0, 2);
      let birthYear = (parseInt(year) < parseInt(currentYear)) ? ('20' + year) : ('19' + year);
      this.newEmployeeForm.patchValue({
        dateOfBirth: new Date(Date.UTC(parseInt(birthYear), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0))
          .toISOString()
      });
    }
    if (gender) {
      gender > 4999 ? this.newEmployeeForm.patchValue({ gender: 1 }) : this.newEmployeeForm.patchValue({ gender: 2 })
    }
  }

  removeByCategory(category: number): void {
    this.employeeDocumentModels = this.employeeDocumentModels.filter(file => file.fileCategory !== category);
    this.categories[category].state = true;
  }

  removeAllDocuments(): void {
    Object.keys(this.categories).forEach(catKey => {
      const catNum = parseInt(catKey, 10);
      this.employeeDocumentModels = this.employeeDocumentModels.filter(file => file.fileCategory !== catNum);
      this.categories[catNum].state = true;
    });
  }

  setHasDisability(event: any) {
    this.hasDisability = event.value;
  }

  setTypeOther(event: any) {
    if (event.source.value == 'Other') {
      this.typeOther = true;
    }
    else {
      this.typeOther = false;
    }
  }

  private createAddressForm(): FormGroup {
    return new FormGroup({
      unitNumber: new FormControl<string | null>('', Validators.minLength(1)),
      complexName: new FormControl<string | null>('', Validators.minLength(1)),
      suburbDistrict: new FormControl<string | null>('', Validators.minLength(1)),
      city: new FormControl<string | null>('', Validators.minLength(1)),
      streetNumber: new FormControl<string | null>('', [Validators.maxLength(4), Validators.minLength(1)]),
      streetName: new FormControl<string | null>('', Validators.minLength(1)),
      country: new FormControl<string | null>('', Validators.minLength(1)),
      province: new FormControl<string | null>('', Validators.minLength(1)),
      postalCode: new FormControl<string | null>('', [Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/(^\d+$)|(^$)/)]),
    });
  }

  private createEmployeeForm(): FormGroup {
    return new FormGroup({
      id: new FormControl<number>(0, [Validators.pattern(/^[0-9]*$/), Validators.required]),
      employeeNumber: new FormControl<string>('0', Validators.pattern(/^(\w{3})(\d{3})$/)),
      taxNumber: new FormControl<string>('0000000000', Validators.pattern(/^\d{10}$/)),
      engagementDate: new FormControl<Date | string>(new Date(Date.now()), Validators.required),
      terminationDate: new FormControl<Date | string | null>(null),
      reportingLine: new FormControl<EmployeeProfile | null>(null),
      highestQualication: new FormControl<string>(''),
      disability: new FormControl<boolean | null>(false, [Validators.required]),
      disabilityType: new FormControl<string>(''),
      disabilityNotes: new FormControl<string>(''),
      countryOfBirth: new FormControl<string>(''),
      nationality: new FormControl<string>(''),
      level: new FormControl<number>(-1, [Validators.pattern(/^[0-9]*$/), Validators.required]),
      employeeType: new FormControl<{ id: number; name: string } | null>(null, Validators.required),
      name: new FormControl<string>('', [Validators.required,
      Validators.pattern(this.namePattern)]),
      initials: new FormControl<string>('', [Validators.required,
      Validators.pattern(this.initialsPattern)]),
      surname: new FormControl<string>('', [Validators.required,
      Validators.pattern(this.namePattern)]),
      dateOfBirth: new FormControl<Date | string>(new Date(Date.now()), Validators.required),
      idNumber: new FormControl<string>('', [Validators.required, this.customValidationService.idNumberValidator]),
      passportNumber: new FormControl<string>(''),
      passportExpiryDate: new FormControl<Date | string | null>(new Date(Date.now())),
      passportCountryIssue: new FormControl<string>(''),
      race: new FormControl<number | null>(null),
      gender: new FormControl<number | null>(null),
      email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern),]),
      personalEmail: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]),
      cellphoneNo: new FormControl<string>('', [Validators.required]),
      photo: new FormControl<string>(''),
      notes: new FormControl<string>(''),
      leaveInterval: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
      salaryDays: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
      payRate: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
      salary: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
      physicalAddress: new FormControl<EmployeeAddress | null>(null),
      postalAddress: new FormControl<EmployeeAddress | null>(null),
      peopleChampion: new FormControl<string>('')
    });
  }
}