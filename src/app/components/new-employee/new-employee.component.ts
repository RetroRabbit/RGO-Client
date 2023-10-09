import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private cookieService: CookieService
    ) { }

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  genders: string[] = ["Prefer not to say", "Male", "Female"];
  races: string[] = ["Black", "White", "Indian", "Coloured", "Asian"];
  levels: number[] = [2, 3, 4, 5, 6];
  
  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    })
  }

  files: File[] = [];
  supportedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx'];

  get supportedExtensionsAsString() {
    return this.supportedExtensions
    .map(fielType => `.${fielType}`)
    .join(',');
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
        alert(`File type "${ext}" is not supported. Please select a valid file.`);
      }
    }
    input.value = '';
  }

  removeSelect(fileName: string): void {
    this.files = this.files.filter(file => file.name !== fileName);
  }

  checkFieldUpdated(field: string): boolean {
    if (!this.newEmployeeForm.get(field)) return false
    return this.newEmployeeForm.get(field)!.invalid && (this.newEmployeeForm.get(field)!.dirty || this.newEmployeeForm.get(field)!.touched);
  }

  newEmployeeForm = new FormGroup({
    id: new FormControl<number>(0, Validators.required),
    employeeNumber: new FormControl<string>('', Validators.required),
    taxNumber: new FormControl<string>('', Validators.required),
    engagementDate: new FormControl<Date>(new Date(), Validators.required),
    terminationDate: new FormControl<Date | null>(new Date(), Validators.required),
    reportingLine: new FormControl<number>(0, Validators.required),
    highestQualification: new FormControl<string>('', Validators.required),
    disability: new FormControl<boolean>(false, Validators.required),
    disabilityNotes: new FormControl<string>('', Validators.required),
    countryOfBirth: new FormControl<string>('', Validators.required),
    nationality: new FormControl<string>('', Validators.required),
    level: new FormControl<number>(0, Validators.required),
    employeeType: new FormControl<{id: number, name: string} | null>(null, Validators.required),
    title: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    initials: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl<Date>(new Date(), Validators.required),
    idNumber: new FormControl<string>('', Validators.required),
    passportNumber: new FormControl<string>('', Validators.required),
    passportExpirationDate: new FormControl<Date>(new Date(), Validators.required),
    passportCountryIssue: new FormControl<string>('', Validators.required),
    race: new FormControl<number>(0, Validators.required),
    gender: new FormControl<number>(0, Validators.required),
    knownAs: new FormControl<string>('', Validators.required),
    pronouns: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    personalEmail: new FormControl<string>('', [Validators.required, Validators.email]),
    cellphoneNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    photo: new FormControl<string>(''),
  });

  saveImageAsBase64(event: any) {
    const file = event.target.files[0];

    this.newEmployeeForm.patchValue({ photo: 'base64 image'})
  }

  getImageFromBase64() {
    const photo = this.newEmployeeForm.get('photo')?.value;
    return photo ? `data:image/png;base64,${photo}` : '';
  }

  log() {
    console.log(this.newEmployeeForm.value);
  }

  onSubmit(stay: boolean = false) {
    this.newEmployeeForm.value.cellphoneNo = this.newEmployeeForm.value.cellphoneNo?.toString();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => { if (!stay) this.cookieService.set("currentlPage", "Dashboard") },
      error: (error) => { }
    })
  }

  onCancel() {
    console.log("cancel");
    this.cookieService.set("currentPage", "Dashboard")
  }
}
