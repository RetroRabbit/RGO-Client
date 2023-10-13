import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private cookieService: CookieService,
    private toast: NgToastService
  ) {}

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  genders: string[] = ['Prefer not to say', 'Male', 'Female'];
  races: string[] = ['Black', 'White', 'Indian', 'Coloured', 'Asian'];
  levels: number[] = [2, 3, 4, 5, 6];

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  Employees: EmployeeProfile[] = [];
  selectedEmployee!: EmployeeProfile;
  validImage: boolean = false;

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

  files: File[] = [];
  supportedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx'];

  get supportedExtensionsAsString() {
    return this.supportedExtensions.map((fielType) => `.${fielType}`).join(',');
  }

  onSelect(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (this.supportedExtensions.includes(ext || '')) {
        this.files.push(file);
      } else {
        alert(
          `File type "${ext}" is not supported. Please select a valid file.`
        );
      }
    }
    input.value = '';
  }

  removeSelect(fileName: string): void {
    this.files = this.files.filter((file) => file.name !== fileName);
  }

  checkFieldUpdated(field: string): boolean {
    if (!this.newEmployeeForm.get(field)) return false;
    return (
      this.newEmployeeForm.get(field)!.invalid &&
      (this.newEmployeeForm.get(field)!.dirty ||
        this.newEmployeeForm.get(field)!.touched)
    );
  }
  newEmployeeForm = new FormGroup({
    id: new FormControl<number>(0, Validators.required),
    employeeNumber: new FormControl<string>(
      '0',
      Validators.pattern(/^[0-9]*$/)
    ),
    taxNumber: new FormControl<string>('0', Validators.pattern(/^[0-9]*$/)),
    engagementDate: new FormControl<Date>(new Date(), Validators.required),
    terminationDate: new FormControl<Date | null>(null, Validators.required),
    reportingLine: new FormControl<EmployeeProfile | null>(
      null,
      Validators.required
    ),
    highestQualification: new FormControl<string>('', Validators.required),
    disability: new FormControl<boolean>(false, Validators.required),
    disabilityNotes: new FormControl<string>('', Validators.required),
    notes: new FormControl<string>('', Validators.required),
    countryOfBirth: new FormControl<string>('', Validators.required),
    nationality: new FormControl<string>('', Validators.required),
    level: new FormControl<number>(0, Validators.pattern(/^[0-9]*$/)),
    leaveInterval: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    salaryDays: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    payRate: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    salary: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    employeeType: new FormControl<{ id: number; name: string } | null>(
      null,
      Validators.required
    ),
    title: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    initials: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl<Date>(new Date(), Validators.required),
    idNumber: new FormControl<string>('', Validators.required),
    race: new FormControl<number>(0, Validators.required),
    gender: new FormControl<number>(0, Validators.required),
    knownAs: new FormControl<string>('', Validators.required),
    pronouns: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.pattern(this.emailPattern),
    ]),
    personalEmail: new FormControl<string>('', [
      Validators.required,
      Validators.email,
    ]),
    cellphoneNo: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
    ]),
    photo: new FormControl<string>(''),
  });

  log() {
    console.log(this.newEmployeeForm.value);
  }

  onSubmit(reset: boolean = false) {
    this.newEmployeeForm.value.cellphoneNo =
      this.newEmployeeForm.value.cellphoneNo?.toString().trim();
    this.checkBlankRequiredFields();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => {
        this.toast.success({
          detail: 'Success',
          summary: `${this.newEmployeeForm.value.name} has been added`,
          duration: 5000,
          position: 'topRight',
        });
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
      this.newEmployeeForm.patchValue({'photo' : 'data:image/jpeg;base64,' + base64Image});
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
