import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private messageService: MessageService) { }

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  genders: string[] = ["Male", "Female", "Other"];
  races: string[] = ["Black", "White", "American Indian or Alaska Native", "Latino or Hispanic", "Asian", "Pacific Islander or Hawaiian"];
  levels: number[] = [2, 3, 4, 5, 6];
  titles: string[] = ["Mr", "Mrs", "Miss", "Ms", "Sir"];

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = "";
  imageUrl: string = '';
  Employees: EmployeeProfile[] = [];
  selectedEmployee !: EmployeeProfile;
  validImage : boolean = false;
  ngOnInit(): void {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    })
    this.employeeService.getAllProfiles().subscribe(
      data => {
        this.Employees = data;
      }
    );
  }

  newEmployeeForm = new FormGroup({
    title: new FormControl('Other', Validators.required),
    name: new FormControl('', Validators.required),
    initials: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
    personalEmail: new FormControl('', [Validators.required, Validators.email]),
    countryOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    engagementDate: new FormControl('', Validators.required),
    employeeType: new FormControl('', Validators.required),
    cellphoneNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    employeeNumber: new FormControl('0',Validators.pattern(/^[0-9]*$/)),
    taxNumber: new FormControl('0', Validators.pattern(/^[0-9]*$/)),
    disabilityNotes: new FormControl('Enter notes here'),
    notes: new FormControl('Enter notes here'),
    photo: new FormControl(''),
    dateOfBirth: new FormControl(''),
    disability: new FormControl(false),
    level: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    leaveInterval: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    salaryDays: new FormControl(0, Validators.pattern(/^[0-9]*$/)),
    payRate: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    salary: new FormControl(1, Validators.pattern(/^[0-9]*$/)),
    // // optional
    reportingLine: new FormControl(),
    passportNumber: new FormControl('0',Validators.pattern(/^[0-9]*$/)),
    idNumber: new FormControl( '0',Validators.pattern(/^[0-9]*$/)),
    passportExpirationDate: new FormControl(),
    passportCountryIssue: new FormControl(),
    terminationDate: new FormControl(),
    // // ToDo: Make number when enum is updated
    race: new FormControl(1),
    gender: new FormControl(1),
  });



  onSubmit() {
    // console.log(this.newEmployeeForm.value.level)
    this.newEmployeeForm.value.cellphoneNo = this.newEmployeeForm.value.cellphoneNo?.toString();
    this.checkBlankRequiredFields();
    console.table(this.newEmployeeForm.value);
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => { 
        this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: `${this.newEmployeeForm.value.name}, has successfully been added to the database.` });
      },
      error: (error) => {
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
        this.messageService.add({ key: 'toast2', severity: 'error', summary: 'Error', detail: `${this.newEmployeeForm.value.name}, was not added to database` });
        console.error(error)
      }
    })
  }

  checkBlankRequiredFields() {
    this.newEmployeeForm.value.dateOfBirth = this.newEmployeeForm.value.dateOfBirth === '' ? this.newEmployeeForm.value.engagementDate : this.newEmployeeForm.value.dateOfBirth;
    this.newEmployeeForm.value.title = this.newEmployeeForm.value.title === '' ? 'TBA' : this.newEmployeeForm.value.title;
    this.newEmployeeForm.value.countryOfBirth = this.newEmployeeForm.value.countryOfBirth === '' ? 'TBA' : this.newEmployeeForm.value.countryOfBirth;
    this.newEmployeeForm.value.nationality = this.newEmployeeForm.value.nationality === '' ? 'TBA' : this.newEmployeeForm.value.nationality;
    this.newEmployeeForm.value.employeeNumber = this.newEmployeeForm.value.employeeNumber === '' ? 'TBA' : this.newEmployeeForm.value.employeeNumber?.toString();
    this.newEmployeeForm.value.taxNumber = this.newEmployeeForm.value.taxNumber === '' ? 'TBA' : this.newEmployeeForm.value.taxNumber?.toString();
    this.newEmployeeForm.value.passportNumber = this.newEmployeeForm.value.passportNumber === '0' ? 'TBA' : this.newEmployeeForm.value.passportNumber?.toString();
    this.newEmployeeForm.value.idNumber = this.newEmployeeForm.value.idNumber === '0' ? 'TBA' : this.newEmployeeForm.value.idNumber?.toString();
    this.newEmployeeForm.value.disabilityNotes = this.newEmployeeForm.value.disabilityNotes === '' ? 'TBA' : this.newEmployeeForm.value.disabilityNotes;
    this.newEmployeeForm.value.notes = this.newEmployeeForm.value.notes === '' ? 'TBA' : this.newEmployeeForm.value.notes;
    this.newEmployeeForm.value.photo = this.newEmployeeForm.value.photo === '' ? 'TBA' : this.newEmployeeForm.value.photo;
  }

  imageHandler(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      if (this.validateFile(file)) {

        this.imageConverter(file);
        this.validImage = true;
      }
      else {
        this.clearUpload();
        this.validImage = false;
      }
    }
    else {
      // cannot read file
      this.validImage = false;
    }
  }

  validateFile(file: File): boolean {
    if (file.size > 4194304) {
      console.log('Too big')
      return false;
    }
    return true;
  }

  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = "";
  }

  imageConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      this.imagePreview = reader.result as string;
      const base64Image = this.convertTobase64(this.imagePreview);
      this.newEmployeeForm.patchValue({'photo' : base64Image});
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

  setSelectedEmployee(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({'reportingLine': this.Employees[+selectedValue]});
  }
}
