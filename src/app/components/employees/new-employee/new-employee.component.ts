import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { titles } from 'src/app/models/constants/titles.constants';
import { level } from 'src/app/models/constants/level.constants';
import { race } from 'src/app/models/constants/race.constants';
import { gender } from 'src/app/models/constants/gender.constants';
import { combineLatest, first } from 'rxjs';
import { countries } from 'src/app/models/constants/country.constants';
import { provinces } from 'src/app/models/constants/provinces.constants';
import { EmployeeAddressService } from 'src/app/services/employee/employee-address.service';
import { EmployeeAddress } from 'src/app/models/employee-address.interface';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatStepper } from '@angular/material/stepper';
import { EmployeeDocument } from 'src/app/models/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/employee/employee-document.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})

export class NewEmployeeComponent implements OnInit {
  @Input() goto: 'dashboard' | 'employees' = 'dashboard';

  constructor(
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private employeeAddressService: EmployeeAddressService,
    private cookieService: CookieService,
    private toast: NgToastService,
    private employeeDocumentService: EmployeeDocumentService
  ) { }

  employeeDocument: EmployeeDocument[] = [];
  public newEmployeeEmail = "";
  public base64String = "";
  public filename = "";
  @ViewChild('stepper') private myStepper!: MatStepper;

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  levels: number[] = level.map((l) => l.value);
  titles: string[] = titles;
  races: string[] = race.map((r) => r.value);
  genders: string[] = gender.map((g) => g.value);
  countries: string[] = countries
  provinces: string[] = provinces

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  Employees: EmployeeProfile[] = [];
  selectedEmployee!: EmployeeProfile;
  validImage: boolean = false;
  public files: NgxFileDropEntry[] = [];
  employeeDocumentModels: EmployeeDocument[] = [];

  public dropped(files: NgxFileDropEntry[]) {
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
                  fileName: file.name,
                  file: base64String,
                  uploadDate: new Date()
                };
                this.employeeDocumentModels.push(employeeDocument);
              },
              error: (error: any) => {
                this.toast.error({
                  detail: 'Error',
                  summary: 'Failed compile documents',
                  duration: 5000,
                  position: 'topRight',
                });
              }
            });
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  onUploadDocument(): void {
    this.employeeDocumentModels.forEach((documentModel) => {
      this.employeeDocumentService.saveEmployeeDocument(documentModel).subscribe({
        next: () => {
          this.toast.success({
            detail: 'Success',
            summary: `files have been uploaded`,
            duration: 5000,
            position: 'topRight',
          });
        },
        error: (error: any) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to save documents',
            duration: 5000,
            position: 'topRight',
          });
        }
      });
    });
    this.employeeDocumentModels = [];
    this.newEmployeeEmail = "";
    this.files = [];
  }
  // public dropped(files: NgxFileDropEntry[]) {
  //   this.files = files;
  //   for (const droppedFile of files) {
  //     // Is it a file?
  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {
  //         // Access the real file
  //         console.log(droppedFile.relativePath, file);
  //         this.filename = file.name;
  //         //Converting the file to base64
  //         const reader = new FileReader();

  //         reader.onload = (e) => {
  //           this.base64String = e.target?.result as string;
  //           console.log(this.base64String);



  //           //user method on service to save the document
  //           // this.employeeDocumentService.saveEmployeeDocument(this.employeeDocument).subscribe((savedDocument) => {
  //           //   console.log('Document saved successfully', savedDocument);
  //           // });
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     } else {
  //       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //       console.log(droppedFile.relativePath, fileEntry);
  //     }
  //   }
  // }

  // onUploadDocument(): void {
  //   // Assuming this.uploadDocumentForm.value.file contains the file data as a base64 string
  //   // and this.uploadDocumentForm.value.fileName contains the name of the file.

  //   // First, get the employee details using the email
  //   this.employeeService.get(this.newEmployeeEmail).subscribe({
  //     next: (employeeProfile: EmployeeProfile) => {
  //       const employeeDocument: EmployeeDocument = {
  //         id: 0,
  //         employeeId: 1, //employeeProfile.id as number,
  //         fileName: this.filename,
  //         file: this.base64String,
  //         uploadDate: new Date()
  //       };

  //       console.log(employeeDocument);

  //       this.employeeDocumentService.saveEmployeeDocument(employeeDocument).subscribe({
  //         next: () => {
  //           this.toast.success({
  //             detail: 'Success',
  //             summary: `${employeeDocument.fileName} has been uploaded`,
  //             duration: 5000,
  //             position: 'topRight',
  //           });
  //         },
  //         error: (error: any) => {
  //           // Handle errors
  //           let message = 'An unexpected error occurred';
  //           if (error.status === 400) {
  //             message = 'Incorrect form values';
  //           } else if (error.status === 406) {
  //             message = 'User already exists';
  //           }
  //           this.toast.error({
  //             detail: 'Error',
  //             summary: `Error: ${message}`,
  //             duration: 5000,
  //             position: 'topRight',
  //           });
  //         }
  //       });
  //     },
  //     error: (error: any) => {
  //       // Handle errors for the get employee call
  //       this.toast.error({
  //         detail: 'Error',
  //         summary: 'Failed to retrieve employee details',
  //         duration: 5000,
  //         position: 'topRight',
  //       });
  //     }
  //   });
  // }
  // public saveDocument() {
  //   this.employeeEmail = this.newEmployeeForm.value.email;
  //   this.employeeService.saveEmployee(this.newEmployeeForm.value);
  // }

  public fileOver(event: Event) {
    console.log(event);
  }
  public fileLeave(event: Event) {
    console.log(event);
  }
  public removeFileByIndex(index: number): void {
    if (index >= 0 && index < this.files.length) {
      this.files.splice(index, 1);
    }
    console.log(index);
  }
  //
  public onFileChange(event: any): void {
    const file = event.target.files[0] as File;
    if (file) {
      this.newEmployeeForm.patchValue({
        photo: file.name,
      });
    }
  }

  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.employeeTypes = data;
      },
    });
    this.employeeService
      .getAllProfiles()
      .subscribe((data: EmployeeProfile[]) => {
        this.Employees = data;
      });
  }

  newEmployeeForm = new FormGroup({
    id: new FormControl<number>(0),
    employeeNumber: new FormControl<string>(
      '0',
      Validators.pattern(/^(\w{3})(\d{3})$/)
    ),
    taxNumber: new FormControl<string>('0000000000', Validators.pattern(/^\d{10}$/)),
    engagementDate: new FormControl<Date | string>(
      new Date(Date.now()),
      Validators.required
    ),
    terminationDate: new FormControl<Date | string | null>(null),
    reportingLine: new FormControl<EmployeeProfile | null>(null),
    highestQualification: new FormControl<string>(''),
    disability: new FormControl<boolean>(false, Validators.required),
    disabilityNotes: new FormControl<string>('', Validators.required),
    countryOfBirth: new FormControl<string>('', Validators.required),
    nationality: new FormControl<string>('', Validators.required),
    level: new FormControl<number>(0, Validators.pattern(/^[0-9]*$/)),
    employeeType: new FormControl<{ id: number; name: string } | null>(null),
    title: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    initials: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl<Date | string>(
      new Date(Date.now()),
      Validators.required
    ),
    idNumber: new FormControl<string>('', Validators.required),
    passportNumber: new FormControl<string>(''),
    passportExpiryDate: new FormControl<Date | string | null>(
      new Date(Date.now())
    ),
    passportCountryIssue: new FormControl<string>(''),
    race: new FormControl<number>(0),
    gender: new FormControl<number>(0, Validators.required),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.pattern(this.emailPattern),
    ]),
    personalEmail: new FormControl<string>('', Validators.email),
    cellphoneNo: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
    ]),
    photo: new FormControl<string>(''),
    notes: new FormControl<string>(''),
    leaveInterval: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    salaryDays: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    payRate: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    salary: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    physicalAddress: new FormControl<EmployeeAddress | null>(null),
    postalAddress: new FormControl<EmployeeAddress | null>(null),
  });

  settingsForm: FormGroup = new FormGroup({
    toggleAdditionalFields: new FormControl<boolean>(
      false,
      Validators.required
    ),
  });

  postalAddressForm: FormGroup = new FormGroup({
    sameAsPhysicalAddress: new FormControl<boolean>(false, Validators.required),
  });

  private createAddressForm(): FormGroup {
    return new FormGroup({
      unitNumber: new FormControl<string | null>("TBD", Validators.minLength(1)),
      complexName: new FormControl<string | null>("TBD", Validators.minLength(1)),
      suburbDistrict: new FormControl<string | null>("TBD", Validators.minLength(1)),
      city: new FormControl<string | null>("TBD", Validators.minLength(1)),
      streetNumber: new FormControl<string | null>("TBD", Validators.minLength(1)),
      country: new FormControl<string | null>("TBD", Validators.minLength(1)),
      province: new FormControl<string | null>("TBD", Validators.minLength(1)),
      postalCode: new FormControl<string | null>("TBD", Validators.minLength(1)),
    });
  }

  physicalAddress: FormGroup = this.createAddressForm();

  postalAddress: FormGroup = this.createAddressForm();

  postalSameAsPhysicalAddress() {
    if (this.postalAddressForm.value.sameAsPhysicalAddress) {
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

  onSubmit(reset: boolean = false): void {
    if (this.newEmployeeForm.value.email !== null && this.newEmployeeForm.value.email !== undefined) {
      this.newEmployeeEmail = this.newEmployeeForm.value.email;
    } else {
      this.toast.error({ detail: 'Error', summary: `please enter your email address`, duration: 5000, position: 'topRight' });
    }
    this.newEmployeeForm.value.cellphoneNo =
      this.newEmployeeForm.value.cellphoneNo?.toString().trim();
    this.newEmployeeForm.patchValue({
      employeeNumber: this.newEmployeeForm.value.surname?.substring(0, 3).toUpperCase() + '000',
      engagementDate: new Date(this.newEmployeeForm.value.engagementDate!)
        .toISOString()
        .split('T')[0],
      dateOfBirth: new Date(this.newEmployeeForm.value.dateOfBirth!)
        .toISOString()
        .split('T')[0],
      physicalAddress: this.physicalAddressObj,
      postalAddress: this.postalAddressObj,
    });
    const employeeEmail: string = this.newEmployeeForm.value.email!;
    this.checkBlankRequiredFields();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: () => {
        this.toast.success({
          detail: 'Success',
          summary: `${this.newEmployeeForm.value.name} has been added`,
          duration: 5000,
          position: 'topRight',
        });

        if (reset) {
          this.newEmployeeForm.reset();
        } else {
          this.CaptureEvent()
        }
        this.myStepper.next();
      },

      error: (error: any) => {
        let message = '';
        if (error.status === 400) {
          message = 'Incorrect form values';
        } else if (error.status === 406) {
          message = 'User already exists';
        }
        this.toast.error({
          detail: 'Error',
          summary: `Error: ${message}`,
          duration: 5000,
          position: 'topRight',
        });
      },
    });
    this.myStepper.next();
  }

  // onUploadDocument(): void {


  //   this.uploadDocumentForm.patchValue({
  //     employee: this.selectedEmployee,
  //     fileName: this.uploadDocumentForm.value.fileName,
  //     file: this.uploadDocumentForm.value.file,
  //     uploadDate: new Date(this.uploadDocumentForm.value.uploadDate!)
  //       .toISOString()
  //       .split('T')[0],
  //   });

  //   var employeedetails = this.employeeService.get(this.newEmployeeEmail);
  //   this.employeeDocument


  //   this.employeeDocumentService
  //     .saveEmployeeDocument(this.employeeDocument[0])
  //     .subscribe({
  //       next: () => {
  //         this.toast.success({
  //           detail: 'Success',
  //           summary: `${this.uploadDocumentForm.value.fileName} has been uploaded`,
  //           duration: 5000,
  //           position: 'topRight',
  //         });
  //       },
  //       error: (error: any) => {
  //         let message = '';
  //         if (error.status === 400) {
  //           message = 'Incorrect form values';
  //         } else if (error.status === 406) {
  //           message = 'User already exists';
  //         }
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: `Error: ${message}`,
  //           duration: 5000,
  //           position: 'topRight',
  //         });
  //       },
  //     });
  // }



  goToEmployees() {
    this.cookieService.set('currentPage', 'Employees');
  }

  CaptureEvent() {
    if (this.goto == 'employees') this.cookieService.set('currentPage', 'View Employee');
    else this.cookieService.set('currentPage', 'Dashboard');
  }

  checkBlankRequiredFields() {
    this.newEmployeeForm.value.dateOfBirth = this.newEmployeeForm.value
      .dateOfBirth
      ? this.newEmployeeForm.value.engagementDate
      : new Date(Date.now());
    this.newEmployeeForm.value.title =
      this.newEmployeeForm.value.title === ''
        ? 'TBA'
        : this.newEmployeeForm.value.title?.trim();
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
}
