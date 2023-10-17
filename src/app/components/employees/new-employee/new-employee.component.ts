import { Component, OnInit } from '@angular/core';
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
import { FieldCode } from 'src/app/models/field-code.interface';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { FieldCodeOptions } from 'src/app/models/field-code-options.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';
import {
  Observable,
  combineLatest,
  first,
  map,
  retry,
  take,
} from 'rxjs';
import { EmployeeDataService } from 'src/app/services/employee-data.service';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { FieldCodes } from 'src/app/models/constants/field-codes.constants';

interface AddressControls {
  unitNumber: FormControl<string | null>;
  complexName: FormControl<string | null>;
  suburbDistrict: FormControl<string | null>;
  streetNumber: FormControl<string | null>;
  country: FormControl<string | null>;
  province: FormControl<string | null>;
  postalCode: FormControl<string | null>;
}

interface TshirtControls {
  tShirtSize: FormControl<string | null>;
}

interface DietaryControls {
  dietary: FormControl<string | null>;
}

interface AllergiesControls {
  allergies: FormControl<string | null>;
}

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private fieldCodeService: FieldCodeService,
    private employeeDataService: EmployeeDataService,
    private cookieService: CookieService,
    private toast: NgToastService
  ) { }

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  levels: number[] = level.map((l) => l.value);
  titles: string[] = titles;
  races: string[] = race.map((r) => r.value);
  genders: string[] = gender.map((g) => g.value);

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  Employees: EmployeeProfile[] = [];
  selectedEmployee!: EmployeeProfile;
  validImage: boolean = false;

  onFileChange(event: any): void {
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
    id: new FormControl<number>(0, Validators.required),
    employeeNumber: new FormControl<string>(
      '0',
      Validators.pattern(/^[0-9]*$/)
    ),
    taxNumber: new FormControl<string>('0', Validators.pattern(/^[0-9]*$/)),
    engagementDate: new FormControl<Date | string>(
      new Date(Date.now()),
      Validators.required
    ),
    terminationDate: new FormControl<Date | string | null>(null),
    reportingLine: new FormControl<EmployeeProfile | null>(null),
    highestQualification: new FormControl<string>('', Validators.required),
    disability: new FormControl<boolean>(false, Validators.required),
    disabilityNotes: new FormControl<string>('', Validators.required),
    notes: new FormControl<string>(''),
    countryOfBirth: new FormControl<string>('', Validators.required),
    nationality: new FormControl<string>('', Validators.required),
    passportNumber: new FormControl<string>(''),
    passportExpiryDate: new FormControl<Date | string | null>(
      new Date(Date.now())
    ),
    passportCountryIssue: new FormControl<string>(''),
    level: new FormControl<number>(0, Validators.pattern(/^[0-9]*$/)),
    leaveInterval: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    salaryDays: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    payRate: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    salary: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
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

  private createAddressForm(): FormGroup<AddressControls> {
    return new FormGroup<AddressControls>({
      unitNumber: new FormControl<string | null>(null, Validators.minLength(1)),
      complexName: new FormControl<string | null>(null, Validators.minLength(1)),
      suburbDistrict: new FormControl<string | null>(null, Validators.minLength(1)),
      streetNumber: new FormControl<string | null>(null, Validators.minLength(1)),
      country: new FormControl<string | null>(null, Validators.minLength(1)),
      province: new FormControl<string | null>(null, Validators.minLength(1)),
      postalCode: new FormControl<string | null>(null, Validators.minLength(1)),
    });
  }

  physicalAddress: FormGroup<AddressControls> = this.createAddressForm();

  postalAddress: FormGroup<AddressControls> = this.createAddressForm();

  tshirtForm: FormGroup<TshirtControls> = new FormGroup({
    tShirtSize: new FormControl<string | null>(null, Validators.minLength(1)),
  })

  dietaryForm: FormGroup<DietaryControls> = new FormGroup({
    dietary: new FormControl<string | null>(null, Validators.minLength(1)),
  })

  allergiesForm: FormGroup<AllergiesControls> = new FormGroup({
    allergies: new FormControl<string | null>(null, Validators.minLength(1)),
  })

  postalSameAsPhysicalAddress() {
    if (this.postalAddressForm.value.sameAsPhysicalAddress) {
      this.postalAddress.patchValue({
        unitNumber: this.physicalAddress.value.unitNumber,
        complexName: this.physicalAddress.value.complexName,
        suburbDistrict: this.physicalAddress.value.suburbDistrict,
        streetNumber: this.physicalAddress.value.streetNumber,
        country: this.physicalAddress.value.country,
        province: this.physicalAddress.value.province,
        postalCode: this.physicalAddress.value.postalCode,
      });
    }
  }

  getEmployeeData(
    employeeId: number,
    fieldCodeId: number,
    value: string
  ): EmployeeData {
    return {
      id: 0,
      employeeId: employeeId,
      fieldCodeId: fieldCodeId,
      value: value,
    };
  }

  private createFieldCode(
    code: FieldCodes,
    addressName: string
  ): void {
    console.info(`[Creating field code(${addressName})]`);
    const options: FieldCodeOptions[] = [
      'Unit Number',
      'Complex Name',
      'Suburb/District',
      'Street Number',
      'Country',
      'Province',
      'Postal Code',
    ].map((option: string) => {
      return {
        id: 0,
        fieldCode: 0,
        option: option,
      };
    });

    const address: FieldCode = {
      id: 0,
      code: code,
      name: addressName,
      description: addressName,
      regex: '',
      type: dataTypes.find((dt) => dt.value === 'String')?.id,
      status: statuses.find((s) => s.value === 'Active')?.id,
      internal: false,
      options: options,
    };

    console.info(`[Saving field code(${addressName})]`);
    console.table(address);

    this.fieldCodeService.saveFieldCode(address).subscribe({
      next: () => console.info(`[Field code(${addressName}) saved]`),
      error: () => console.error(`[Error saving field code(${addressName})]`),
    });
  }

  private getAddressNameFromEnum(code: FieldCodes): string {
    return Object.keys(FieldCodes).find((key: string) => (FieldCodes as Record<string, string>)[key] === code) || '';
  }

  createAddressFieldCodes(code: FieldCodes): void {
    console.info('[Creating address field codes]');
    const addressName = this.getAddressNameFromEnum(code);
    this.createFieldCode(code, addressName);
  }

  getFieldCodeId(
    code: FieldCodes
  ): Observable<number | null | undefined> {
    console.info('[Getting field code id]');
    return this.fieldCodeService.getAllFieldCodes().pipe(
      map((fieldCodes: FieldCode[]) => {
        const matchingCode = fieldCodes.find(
          (fc: FieldCode) => fc.code === code
        );
        if (!matchingCode) {
          this.createAddressFieldCodes(code);
          return null;
        }
        return matchingCode.id;
      }),
      retry(3),
      take(1)
    );
  }

  saveFieldCode(
    code: FieldCodes,
    email: string,
    fieldDescriptions: { key: FormControl<any>; label: string }[]
  ): void {
    console.info(`[Saving ${code} address]`);
    combineLatest([
      this.getFieldCodeId(code).pipe(
        first(),
        map((id: number | null | undefined) => (id ? id : null))
      ),
      this.employeeService.get(email).pipe(
        map((employee: EmployeeProfile) => employee.id),
        retry(3),
        take(1)
      ),
    ]).pipe(first()).subscribe({
      next: ([fieldCodeId, employeeId]) => {
        if (!fieldCodeId) {
          this.toast.error({
            detail: 'Error',
            summary: `Error: Could not save ${code} address`,
            duration: 5000,
            position: 'topRight',
          });
          console.error(`[Error saving ${code} address(i.e.: fieldCodeId is null)]`);
          return;
        }

        fieldDescriptions.forEach((field: { key: FormControl; label: string }) => {
          if (field.key.valid && field.key.value && field.key.value.trim() !== '') {
            const data: EmployeeData = this.getEmployeeData(
              employeeId,
              fieldCodeId!,
              `${field.label}: ${field.key.value}`
            )
            console.info(`[Saving ${field.label} address]`);
            console.table(data);
            this.employeeDataService.saveEmployeeData(data)
              .pipe(first())
              .subscribe({
                next: () => console.info(`[${field.label} saved]`),
                error: (error: any) =>
                  console.error(`[Error saving ${field.label}]\n${error}`),
              });
          }
        })
      },
      error: (error: any) =>
        console.error(`[Error saving ${code} address]\n${error}`),
    })
  }
  
  onSubmit(reset: boolean = false): void {
    this.newEmployeeForm.value.cellphoneNo =
      this.newEmployeeForm.value.cellphoneNo?.toString().trim();
    this.newEmployeeForm.patchValue({
      engagementDate: new Date(this.newEmployeeForm.value.engagementDate!)
        .toISOString()
        .split('T')[0],
      dateOfBirth: new Date(this.newEmployeeForm.value.dateOfBirth!)
        .toISOString()
        .split('T')[0],
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

        this.saveFieldCode(FieldCodes.Physical, employeeEmail, [
          { key: this.physicalAddress.controls.unitNumber, label: 'Unit Number' },
          { key: this.physicalAddress.controls.complexName, label: 'Complex Name' },
          { key: this.physicalAddress.controls.suburbDistrict, label: 'Suburb District' },
          { key: this.physicalAddress.controls.streetNumber, label: 'Street Number' },
          { key: this.physicalAddress.controls.country, label: 'Country' },
          { key: this.physicalAddress.controls.province, label: 'Province' },
          { key: this.physicalAddress.controls.postalCode, label: 'Postal Code' },
        ])
        this.saveFieldCode(FieldCodes.Postal, employeeEmail, [
          { key: this.postalAddress.controls.unitNumber, label: 'Unit Number' },
          { key: this.postalAddress.controls.complexName, label: 'Complex Name' },
          { key: this.postalAddress.controls.suburbDistrict, label: 'Suburb District' },
          { key: this.postalAddress.controls.streetNumber, label: 'Street Number' },
          { key: this.postalAddress.controls.country, label: 'Country' },
          { key: this.postalAddress.controls.province, label: 'Province' },
          { key: this.postalAddress.controls.postalCode, label: 'Postal Code' },
        ])
        this.saveFieldCode(FieldCodes.TShirtSize, employeeEmail, [
          { key: this.tshirtForm.controls.tShirtSize, label: 'T-Shirt Size' },
        ])
        this.saveFieldCode(FieldCodes.Dietary, employeeEmail, [
          { key: this.dietaryForm.controls.dietary, label: 'Dietary' },
        ])
        this.saveFieldCode(FieldCodes.Allergies, employeeEmail, [
          { key: this.allergiesForm.controls.allergies, label: 'Allergies' },
        ])

        if (reset) {
          this.newEmployeeForm.reset();
        } else {
          this.cookieService.set('currentPage', 'Dashboard');
        }
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
        console.error(error);
      },
    });
  }

  CaptureEvent() {
    this.cookieService.set('currentPage', 'Dashboard');
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
      console.log('data:image/jpeg;base64,' + base64Image);
      this.newEmployeeForm.patchValue({
        photo: 'data:image/jpeg;base64,' + base64Image,
      });
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
