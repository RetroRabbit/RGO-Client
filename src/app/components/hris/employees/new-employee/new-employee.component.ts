import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { combineLatest, first } from 'rxjs';
import { countries } from 'src/app/models/hris/constants/countries.constants';
import { provinces } from 'src/app/models/hris/constants/provinces.constants';
import { EmployeeAddressService } from 'src/app/services/hris/employee/employee-address.service';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { MatStepper } from '@angular/material/stepper';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/services/hris/idnumber-validator';
import { color } from 'html2canvas/dist/types/css/types/color';

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
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private employeeAddressService: EmployeeAddressService,
    private cookieService: CookieService,
    private router: Router,
    private customValidationService: CustomvalidationService,
    private employeeDocumentService: EmployeeDocumentService,
    private snackBarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private navService: NavService
  ) { }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = true;

  employeeDocument: EmployeeDocument[] = [];
  public newEmployeeEmail = "";
  public base64String = "";
  public filename = "";
  imageName: string = "";
  @ViewChild('stepper') private myStepper!: MatStepper;

  employeeTypes: EmployeeType[] = [];
  employeeDocumentModels: EmployeeDocument[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  namePattern = /^[a-zA-Z\s'-]*$/;
  initialsPattern = /^[A-Za-z]+$/;
  toggleAdditional: boolean = false;

  levels: number[] = levels.map((level) => level.value);
  races: string[] = races.map((race) => race.value);
  genders: string[] = genders.map((gender) => gender.value);
  countries: string[] = countries
  provinces: string[] = provinces

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  Employees: EmployeeProfile[] = [];
  selectedEmployee!: EmployeeProfile;
  validImage: boolean = false;
  public files: NgxFileDropEntry[] = [];
  PREVIOUS_PAGE = 'previousPage';
  COMPANY_EMAIL = 'retrorabbit.co.za';

  filteredPeopleChamps: any = [];
  peopleChampionId = null;
  isMobileScreen = false;
  isLoadingAddEmployee: boolean = false;
  isSameAddress: boolean = true;
  isSavedEmployee: boolean = false;

  categories: { [key: number]: { name: string, state: boolean } } = {
    0: { name: '', state: true },
    1: { name: '', state: true },
    2: { name: '', state: true },
    3: { name: '', state: true },
  };

  private createAddressForm(): FormGroup {
    return new FormGroup({
      unitNumber: new FormControl<string | null>('', Validators.minLength(1)),
      complexName: new FormControl<string | null>('', Validators.minLength(1)),
      suburbDistrict: new FormControl<string | null>('', Validators.minLength(1)),
      city: new FormControl<string | null>('', Validators.minLength(1)),
      streetNumber: new FormControl<string | null>('', [Validators.maxLength(4), Validators.minLength(1), Validators.pattern(/(^\d+$)|(^$)/)]),
      country: new FormControl<string | null>('', Validators.minLength(1)),
      province: new FormControl<string | null>('', Validators.minLength(1)),
      postalCode: new FormControl<string | null>('', [Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/(^\d+$)|(^$)/)]),
    });
  }

  physicalAddress: FormGroup = this.createAddressForm();

  postalAddress: FormGroup = this.createAddressForm();
  newEmployeeForm = new FormGroup({
    id: new FormControl<number>(0, [Validators.pattern(/^[0-9]*$/), Validators.required]),
    employeeNumber: new FormControl<string>(
      '0',
      Validators.pattern(/^(\w{3})(\d{3})$/)
    ),
    taxNumber: new FormControl<string>('0000000000', Validators.pattern(/^\d{10}$/)),
    engagementDate: new FormControl<Date | string>(new Date(Date.now()), Validators.required),
    terminationDate: new FormControl<Date | string | null>(null),
    reportingLine: new FormControl<EmployeeProfile | null>(null),
    highestQualication: new FormControl<string>(''),
    disability: new FormControl<boolean | null>(null, [Validators.required]),
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
    dateOfBirth: new FormControl<Date | string>(
      new Date(Date.now()),
      Validators.required
    ),
    idNumber: new FormControl<string>('', [Validators.required, this.customValidationService.idNumberValidator]),
    passportNumber: new FormControl<string>(''),
    passportExpiryDate: new FormControl<Date | string | null>(
      new Date(Date.now())
    ),
    passportCountryIssue: new FormControl<string>(''),
    race: new FormControl<number>(-1),
    gender: new FormControl<number | null>(null),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern),
    ]),
    personalEmail: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern("[^_\\W\\s@][\\w.!]*[\\w]*[@][\\w]*[.][\\w.]*")]),
    cellphoneNo: new FormControl('', [Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)
    ]),
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

  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.employeeTypes = data.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      },
    });
    this.employeeService
      .getEmployeeProfiles()
      .subscribe((data: EmployeeProfile[]) => {
        this.Employees = data;
      });
    this.navService.showNavbar = false;
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
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
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            this.employeeService.get(this.newEmployeeEmail).subscribe({
              next: (employeeProfile: EmployeeProfile) => {
                const employeeDocument: EmployeeDocument = {
                  id: 0,
                  employeeId: employeeProfile.id as number,
                  reference: "",
                  fileName: file.name,
                  fileCategory: category,
                  blob: base64String,
                  uploadDate: new Date(),
                  reason: "",
                  status: 3,
                  counterSign: false
                };
                this.employeeDocumentModels.push(employeeDocument);
                this.categories[category].state = false;
                this.categories[category].name = file.name;
              },
              error: (error: any) => {
                this.snackBarService.showSnackbar("Failed to compile documents", "snack-error");
              }
            });
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
        control.updateValueAndValidity();
        control.reset();
      } else if (control instanceof FormGroup) {
        this.clearFormErrorsAndValues(control);
      }
    });
  }

  saveAndExit() {
    this.isSavedEmployee = false;
    this.clearFormErrorsAndValues(this.newEmployeeForm);
    this.clearFormErrorsAndValues(this.uploadDocumentForm);
    this.clearFormErrorsAndValues(this.physicalAddress);
    this.clearFormErrorsAndValues(this.postalAddressForm);
    this.onUploadDocument(this.cookieService.get(this.PREVIOUS_PAGE));
    this.removeAllDocuments();
  }

  saveAndAddAnother() {
    this.isSavedEmployee = false;
    this.clearFormErrorsAndValues(this.newEmployeeForm);
    this.clearFormErrorsAndValues(this.uploadDocumentForm);
    this.clearFormErrorsAndValues(this.physicalAddress);
    this.clearFormErrorsAndValues(this.postalAddressForm);
    this.onUploadDocument('/create-employee');
    this.removeAllDocuments();
  }

  onUploadDocument(nextPage: string): void {
    this.isLoadingAddEmployee = true;
    this.employeeDocumentModels.forEach((documentModel) => {
      this.employeeDocumentService.saveEmployeeDocument(documentModel).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Files have been uploaded", "snack-success");
          this.isLoadingAddEmployee = false;
        },
        error: (error: any) => {
          this.snackBarService.showSnackbar("Failed to save documents", "snack-error");
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

  isDirty = false;

  onSubmit(reset: boolean = false): void {
    this.isLoadingAddEmployee = true;
    if (this.isDirty == true)
      return;

    if (this.newEmployeeForm.value.email !== null && this.newEmployeeForm.value.email !== undefined && this.newEmployeeForm.value.email.endsWith(this.COMPANY_EMAIL)) {
      this.newEmployeeEmail = this.newEmployeeForm.value.email;
    } else {
      this.snackBarService.showSnackbar("Please enter an official Retro Rabbit email address", "snack-error");
      this.isLoadingAddEmployee = false;
      return;
    }
    if (this.newEmployeeForm.value.disability !== null && this.newEmployeeForm.value.disability !== undefined) {
       this.newEmployeeForm.value.disability;
    } else {
      this.snackBarService.showSnackbar("Please select a value for disability ", "snack-error");
      this.isLoadingAddEmployee = false;
      return;
    }
    this.newEmployeeForm.patchValue({id: 0});
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
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: () => {
        this.isSavedEmployee = true;
        this.snackBarService.showSnackbar(`${this.newEmployeeForm.value.name} has been added`, "snack-success");
        this.myStepper.next();
        this.isDirty = false;
        this.isLoadingAddEmployee = false;
      },

      error: (error: any, stepper?: MatStepper) => {
        let message = '';
        if (error.status === 400) {
          message = 'Incorrect form values';
          this.isLoadingAddEmployee = false;
        } else if (error.status === 406) {
          this.isLoadingAddEmployee = false;
        }
        else if (error.status === 200) {
          stepper?.next();
          this.isLoadingAddEmployee = false;
        }
        this.snackBarService.showSnackbar(`Failed to save employee`, "snack-error");
        this.isDirty = false;
        this.isLoadingAddEmployee = false;
      },
    });
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
    this.newEmployeeForm.value.disabilityNotes =
      this.newEmployeeForm.value.disabilityNotes === ''
        ? 'TBA'
        : this.newEmployeeForm.value.disabilityNotes?.trim();
    this.newEmployeeForm.value.disabilityNotes =
      this.newEmployeeForm.value.disabilityNotes === ''
        ? 'TBA'
        : this.newEmployeeForm.value.disabilityNotes?.trim();
    this.newEmployeeForm.value.photo =
      this.newEmployeeForm.value.photo === ''
        ? 'TBA'
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
    if (file.size > 4194304) {
      return false;
    }
    return true;
  }

  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
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

    let dobMatch = dob.match(/\d{2}/g)
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

}
