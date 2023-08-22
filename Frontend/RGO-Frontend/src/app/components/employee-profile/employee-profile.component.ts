import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { GetEmployeeProfile, UpdateEmployeeProfile } from 'src/app/store/actions/employee-profile.actions';
import { EmployeeProfileState } from 'src/app/store/reducers/employee-profile.reducer';
import { EmployeeProfile } from '../../models/employee-profile.interface';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  isEdit : boolean = false;
  EmployeeProfile$ : Observable<EmployeeProfile> = this.employeeStore.select( state  => state.employee.employeeProfile)
  
  editID : number = -1;
  editEmployeeNumber !: string;
  editTaxNumber !: string;
  editEngagementDate !: Date;
  editTerminationDate !: Date;
  editReportingLine !: number;
  editHighestQualifications !: string;
  editDisability !: boolean;
  editDisabilityNotes !: string;
  editCountryofBirth !: string;
  editNationality !: string;
  editLevel !: number;
  editEmployeeType !: string; 
  editTitle !: string;
  editName !: string;
  editInitials !: string;
  editSurname !: string;
  editDateOfBirth !: Date;
  editIDNumber !: string;
  editPassportNumber !: string;
  editpassportExpirationDate !: Date;
  editPassportCountryIssue !: string;
  editRace !: number;
  editGender !: number;
  editKnownAs !: string;
  editPronouns !: string;
  editRetroEmail !: string;
  editPersonalEmail !: string;
  editCellphoneNo !: string;
  editTshirtSize !: number;
  editDietaryRestrictions !: string;


  constructor(private employeeStore: Store<{ employee: EmployeeProfileState }>) { }
  ngOnInit() {
    this.employeeStore.dispatch(GetEmployeeProfile());
  }
  EditEmployee(employee : EmployeeProfile){
    this.isEdit = !this.isEdit;
    this.editID = employee.id;
    this.editEmployeeNumber = employee.employeeNumber;
    this.editTaxNumber = employee.taxNumber;
    this.editEngagementDate = employee.engagementDate;
    this.editTerminationDate = employee.terminationDate;
    this.editReportingLine = employee.reportingLine;
    this.editHighestQualifications = employee.highestQualification;
    this.editDisabilityNotes = employee.disabilityNotes;
    this.editDisability = employee.disability;
    this.editCountryofBirth = employee.countryOfBirth;
    this.editNationality = employee.nationality;
    this.editLevel = employee.level;
    this.editEmployeeType = employee.employeeType; 
    this.editTitle = employee.title;
    this.editName = employee.name;
    this.editInitials = employee.initials;
    this.editSurname = employee.surname;
    this.editDateOfBirth = employee.dateOfBirth;
    this.editIDNumber = employee.idNumber;
    this.editPassportNumber = employee.passportNumber;
    this.editpassportExpirationDate = employee.passportExpirationDate;
    this.editPassportCountryIssue = employee.passportCountryIssue;
    this.editRace = employee.race;
    this.editGender = employee.gender;
    this.editKnownAs = employee.knownAs;
    this.editPronouns = employee.pronouns;
    this.editRetroEmail = employee.email;
    this.editPersonalEmail = employee.personalEmail;
    this.editCellphoneNo = employee.cellphoneNo;
    this.editTshirtSize = employee.tshirtSize;
    this.editDietaryRestrictions =  employee.dietaryRestrictions;
  }
  SaveChanges(){
    this.isEdit = !this.isEdit;
    const updatedEmployee : EmployeeProfile = {
      id: this.editID,
      employeeNumber: this.editEmployeeNumber,
      taxNumber: this.editTaxNumber,
      engagementDate: this.editEngagementDate,
      terminationDate: this.editTerminationDate,
      reportingLine: this.editReportingLine,
      highestQualification: this.editHighestQualifications,
      disability: this.editDisability,
      disabilityNotes: this.editDisabilityNotes,
      countryOfBirth: this.editCountryofBirth,
      nationality: this.editNationality,
      level: this.editLevel,
      employeeType: this.editEmployeeType,
      title: this.editTitle,
      name: this.editName,
      initials: this.editInitials,
      surname: this.editSurname,
      dateOfBirth: this.editDateOfBirth,
      idNumber: this.editIDNumber,
      passportNumber: this.editPassportNumber,
      passportExpirationDate: this.editpassportExpirationDate,
      passportCountryIssue: this.editPassportCountryIssue,
      race: this.editRace,
      gender: this.editGender,
      knownAs: this.editKnownAs,
      pronouns: this.editPronouns,
      email: this.editRetroEmail,
      personalEmail: this.editPersonalEmail,
      cellphoneNo: this.editCellphoneNo,
      tshirtSize: this.editTshirtSize,
      dietaryRestrictions: this.editDietaryRestrictions
    }
    console.log(updatedEmployee)
    this.employeeStore.dispatch(UpdateEmployeeProfile({updatedProfile : updatedEmployee}));
    setTimeout(()=>{
      this.employeeStore.dispatch(GetEmployeeProfile());
    }, 500);
  }
  CancelEdit(){
    this.isEdit = !this.isEdit
  }
}
