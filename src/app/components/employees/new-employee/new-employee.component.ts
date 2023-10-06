import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private toast: NgToastService
) { }

  employeeTypes: EmployeeType[] = [];
  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  toggleAdditional: boolean = false;

  genders: string[] = ["Prefer not to say", "Male", "Female"];
  races: string[] = ["Black", "White", "Indian", "Coloured", "Asian"];
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
    reportingLine: new FormControl(),
    passportNumber: new FormControl('0',Validators.pattern(/^[0-9]*$/)),
    idNumber: new FormControl( '0',Validators.pattern(/^[0-9]*$/)),
    passportExpirationDate: new FormControl(),
    passportCountryIssue: new FormControl(),
    terminationDate: new FormControl(),
    race: new FormControl(0),
    gender: new FormControl(0),
  });



  onSubmit() {
    this.newEmployeeForm.value.cellphoneNo = this.newEmployeeForm.value.cellphoneNo?.toString().trim();
    this.checkBlankRequiredFields();
    this.employeeService.addEmployee(this.newEmployeeForm.value).subscribe({
      next: (data) => { 
        this.toast.success({detail:"Success",summary:`${this.newEmployeeForm.value.name} has been added`,duration:5000, position:'topRight'});
      },
      error: (error) => {
        let message  = ""
        if (error.status === 400) {
          message = "Incorrect form values"
          } else if (error.status === 406) {
          message = "User already exists"
        } 
        this.toast.error({detail:"Error", summary:`Error: ${message}`,duration:5000, position:'topRight'});
        console.error(error)
      }
    })
  }

  checkBlankRequiredFields() {
    this.newEmployeeForm.value.dateOfBirth = this.newEmployeeForm.value.dateOfBirth === '' ? this.newEmployeeForm.value.engagementDate : this.newEmployeeForm.value.dateOfBirth?.trim();
    this.newEmployeeForm.value.title = this.newEmployeeForm.value.title === '' ? 'TBA' : this.newEmployeeForm.value.title?.trim();
    this.newEmployeeForm.value.countryOfBirth = this.newEmployeeForm.value.countryOfBirth === '' ? 'TBA' : this.newEmployeeForm.value.countryOfBirth?.trim();
    this.newEmployeeForm.value.nationality = this.newEmployeeForm.value.nationality === '' ? 'TBA' : this.newEmployeeForm.value.nationality?.trim();
    this.newEmployeeForm.value.employeeNumber = this.newEmployeeForm.value.employeeNumber === '' ? 'TBA' : this.newEmployeeForm.value.employeeNumber?.toString().trim();
    this.newEmployeeForm.value.taxNumber = this.newEmployeeForm.value.taxNumber === '' ? 'TBA' : this.newEmployeeForm.value.taxNumber?.toString().trim();
    this.newEmployeeForm.value.passportNumber = this.newEmployeeForm.value.passportNumber === '0' ? 'TBA' : this.newEmployeeForm.value.passportNumber?.toString().trim();
    this.newEmployeeForm.value.idNumber = this.newEmployeeForm.value.idNumber === '0' ? 'TBA' : this.newEmployeeForm.value.idNumber?.toString().trim();
    this.newEmployeeForm.value.disabilityNotes = this.newEmployeeForm.value.disabilityNotes === '' ? 'TBA' : this.newEmployeeForm.value.disabilityNotes?.trim();
    this.newEmployeeForm.value.notes = this.newEmployeeForm.value.notes === '' ? 'TBA' : this.newEmployeeForm.value.notes?.trim();
    this.newEmployeeForm.value.photo = this.newEmployeeForm.value.photo === '' ? 'TBA' : this.newEmployeeForm.value.photo?.trim();
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
    input.value = "";
  }

  imageConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      this.imagePreview = reader.result as string;
      const base64Image = this.convertTobase64(this.imagePreview);
      console.log('data:image/jpeg;base64,'+base64Image);
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

  setSelectedEmployee(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({'reportingLine': this.Employees[+selectedValue]});
  }

  setSelectedRace(event : Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({'race': +selectedValue});
  }

  setSelectedGender(event : Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newEmployeeForm.patchValue({'gender': +selectedValue});
  }
}
