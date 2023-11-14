import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Client } from 'src/app/models/client.interface';
import { gender } from 'src/app/models/constants/gender.constants';
import { general } from 'src/app/models/constants/general.constants';
import { level } from 'src/app/models/constants/level.constants';
import { race } from 'src/app/models/constants/race.constants';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { FieldCode } from 'src/app/models/field-code.interface';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeDataService } from 'src/app/services/employee-data.service';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  @Input() selectedEmployee!: any | null;
  employeeForm!: FormGroup;

  employeeTypes: EmployeeType[] = [];
  employeeData: EmployeeData[] = [];
  fieldcodes: FieldCode[] = [];
  employeeFieldcodes: any = [];
  employees: any = [];
  viewMoreInfo: boolean = false;
  toEdit: boolean = false;
  filteredEmployees: any = [];
  clients: Client[] = [];
  filteredClients: any = [];
  employeeId?: number = 0;
  clientId?: number = 0;
  foundClient: any;
  foundTeamLead: any;
  filteredPeopleChamps: any = [];
  employeeRoles: any = [];
  peopleChampionId: number = 0;
  foundChampion: any;
  
  public genderTypes = gender;
  public raceTypes = race;
  public generalTypes = general;
  public levelTypes = level;

  constructor(private fb: FormBuilder, 
    private employeeTypeService: EmployeeTypeService,
    private employeeDataService: EmployeeDataService, 
    private fieldcodeService: FieldCodeService, 
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private toast: NgToastService,
    private clientService: ClientService,
    private employeeRoleService: EmployeeRoleService
  ) { }

  ngOnInit(): void {
    this.callService();
  }

  private callService() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: data => {
        this.employeeTypes = data;
      }
    });
    this.employeeDataService.getEmployeeData(this.selectedEmployee.id).subscribe({
      next: data => {
        this.employeeData = data;
      }
    });
    this.fieldcodeService.getAllFieldCodes().subscribe({
      next: data => {
        this.fieldcodes = data
      }
    });
    this.employeeService.getAllProfiles().subscribe({
      next: data => {
        this.employees = data;
      }
    });
    this.clientService.getAllClients().subscribe({
      next: data => {
        this.clients = data;
      }
    });
    this.employeeRoleService.getEmployeeOnRoles(4).subscribe({
      next: data => {
        this.employeeRoles = data;
        console.log("HERE")
        console.log(data)
      }
    })

    this.initializeForm();
  }

  private initializeForm() {
    this.employeeForm = this.fb.group({
      name: [this.selectedEmployee?.name, Validators.required],
      initials: [this.selectedEmployee?.initials, Validators.required],
      surname: [this.selectedEmployee?.surname, Validators.required],
      email: [this.selectedEmployee?.email, Validators.required],
      personalEmail: [this.selectedEmployee?.personalEmail, Validators.required],
      countryOfBirth: [this.selectedEmployee?.countryOfBirth, Validators.required],
      nationality: [this.selectedEmployee?.nationality, Validators.required],
      engagementDate: [this.selectedEmployee?.engagementDate, Validators.required],
      employeeType: [this.selectedEmployee?.employeeType.name, Validators.required],
      cellphoneNo: [this.selectedEmployee?.cellphoneNo, Validators.required],
      employeeNumber: [this.selectedEmployee?.employeeNumber, Validators.required],
      taxNumber: [this.selectedEmployee?.taxNumber, Validators.required],
      disabilityNotes: [this.selectedEmployee?.disabilityNotes, Validators.required],
      disability: [this.selectedEmployee.disability == true ? 1 : 0, Validators.required],
      gender: [this.selectedEmployee.gender, Validators.required],
      idNumber: [this.selectedEmployee.idNumber, Validators.required], 
      leaveInterval: [this.selectedEmployee.leaveInterval, Validators.required],
      level: [this.selectedEmployee.level, Validators.required],
      passportCountryIssue: this.selectedEmployee.passportCountryIssue, 
      passportExpirationDate: this.selectedEmployee.passportExpirationDate, 
      passportNumber: this.selectedEmployee.passportNumber, 
      payRate: [this.selectedEmployee.payRate, Validators.required],
      photo: [this.selectedEmployee.photo, Validators.required],
      race: [this.selectedEmployee.race,Validators.required],
      peopleChampion: this.selectedEmployee.peopleChampion, 
      salary: [this.selectedEmployee.salary,Validators.required],
      salaryDays: [this.selectedEmployee.salaryDays,Validators.required],
      terminationDate: this.selectedEmployee.terminationDate, 
      dateOfBirth: [this.selectedEmployee.dateOfBirth, Validators.required],
      clientAllocated: this.selectedEmployee.clientAllocated,
      teamLead: this.selectedEmployee.teamLead,
    });
    this.employeeForm.disable();
  }

  checkEmployeeFieldCode() {
    for (const fieldcode of this.fieldcodes) {
      const name = this.formatString(fieldcode.name)
      const fc = this.employeeData.find((data) => {
        return data.fieldCodeId == fieldcode.id
      });
      this.employeeForm.addControl(name, this.fb.control(fc ? fc.value : ''));
    }

    this.foundTeamLead = this.employees.find((data: any) => {
      return data.id == this.selectedEmployee.teamLead
    });
    this.foundClient = this.clients.find((data: any) => {
      return data.id == this.selectedEmployee.clientAllocated
    });
    this.foundChampion = this.employeeRoles.find((data: any) => {
      return data.employee.id == this.selectedEmployee.peopleChampion
    });

    if(this.foundTeamLead != null ){
      this.employeeForm.get('teamLead')?.setValue(this.foundTeamLead.name + ' ' + this.foundTeamLead.surname);
      this.employeeId = this.foundTeamLead.id
    }

    if(this.foundClient != null){
      this.employeeForm.get('clientAllocated')?.setValue(this.foundClient.name);
      this.clientId = this.foundClient.id
    }

    if(this.foundChampion != null){
      this.employeeForm.get('peopleChampion')?.setValue(this.foundChampion.employee.name + ' ' + this.foundChampion.employee.surname);
      this.peopleChampionId = this.foundChampion.employee.id
    }
    this.employeeForm.disable();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeForm = this.employeeForm.value;

      const employeeProfileDto = {
        id: this.selectedEmployee.id,
        employeeNumber: employeeForm.employeeNumber,
        taxNumber: employeeForm.taxNumber,
        engagementDate: employeeForm.engagementDate,
        terminationDate: employeeForm.terminationDate,
        peopleChampion: this.peopleChampionId == 0 ? null : this.peopleChampionId,
        disability: parseInt(employeeForm.disability) == 0 ? false : true,
        disabilityNotes: employeeForm.disabilityNotes,
        countryOfBirth: employeeForm.countryOfBirth,
        nationality: employeeForm.nationality,
        level: parseInt(employeeForm.level),
        employeeType: {
          id: this.selectedEmployee.employeeType.id,
          name: employeeForm.employeeType,
        },
        name: employeeForm.name,
        initials: employeeForm.initials,
        surname: employeeForm.surname,
        dateOfBirth: employeeForm.dateOfBirth,
        idNumber: employeeForm.idNumber,
        passportNumber: employeeForm.passportNumber,
        passportExpirationDate: employeeForm.passportExpirationDate,
        passportCountryIssue: employeeForm.passportCountryIssue,
        race: parseInt(employeeForm.race),
        gender: parseInt(employeeForm.gender),
        email: employeeForm.email,
        personalEmail: employeeForm.personalEmail,
        cellphoneNo: employeeForm.cellphoneNo,
        photo: employeeForm.photo,
        notes: '',
        leaveInterval: employeeForm.leaveInterval,
        salary: employeeForm.salary,
        salaryDays: employeeForm.salaryDays,
        payRate: employeeForm.payRate, 
        clientAllocated: this.clientId == 0 ? null : this.clientId,
        teamLead: this.employeeId == 0 ? null : this.employeeId
      }
      this.employeeService.updateEmployee(employeeProfileDto).subscribe({
        next: (data) => {
        this.cookieService.set('currentPage', 'Employees');
        this.saveEmployeeCustomData();
        this.toast.success({ detail: "Employee Details updated!", position: 'topRight' });
      },
        error: (error) => {this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' }); },
      }); 
    }
  }

  saveEmployeeCustomData() {
    for (const fieldcode of this.fieldcodes) {
      const found = this.employeeData.find((data) => {
        return fieldcode.id == data.fieldCodeId
      });

      if (found != null) {
        const formatFound = this.formatString(fieldcode?.name)
        const employeeDataDto = {
          id: found.id,
          employeeId: found.employeeId,
          fieldcodeId: found.fieldCodeId,
          value: this.employeeForm.get(formatFound)?.value
        }

        this.employeeDataService.updateEmployeeData(employeeDataDto).subscribe({
          next: (data) => { },
          error: (error) => { },
        });
      }
      else if (found == null) {
        const formatFound = this.formatString(fieldcode?.name)
        const employeeDataDto = {
          id: 0,
          employeeId: this.selectedEmployee.id,
          fieldcodeId: fieldcode.id,
          value: this.employeeForm.get(formatFound)?.value
        }

        if (employeeDataDto.value != '') {
          this.employeeDataService.saveEmployeeData(employeeDataDto).subscribe({
            next: (data) => {
              this.cookieService.set('currentPage', 'Employees'); 
            },
            error: (error) => {
              this.toast.error({ detail: "Error", summary: error, duration: 5000, position: 'topRight' });
            }
          });
        }
      }
    }
  }

  editDetails() {
    this.employeeForm.enable();
    this.toEdit = true;
  }

  viewMore() {
    this.checkEmployeeFieldCode();
    this.viewMoreInfo = true;
  }

  formatString(input: string | undefined): string {
    const words = input?.replace(/['\s]/g, '').split(' ');

    if (words != undefined) {
      for (let i = 0; i < words.length; i++) {
        if (i === 0) {
          words[i] = words[i].toLowerCase();
        }
      }
      return words.join('');
    }
    else return '';
  }

  cancelAction(){
    this.cookieService.set('currentPage', 'Employees');
  }

  filterEmployees(event: any){
    if (event) {
      this.filteredEmployees = this.employees.filter((employee: { name: string; }) =>
        employee.name.toLowerCase().includes(event.target.value.toLowerCase())
      
      );
    } else {
      this.filteredEmployees = this.employees; 
    }
  }

  filterClients(event: any){
    if (event) {
      this.filteredClients = this.clients.filter((client: { name: string; }) =>
        client.name.toLowerCase().includes(event.target.value.toLowerCase())
      
      );
    } else {
      this.filteredClients = this.clients; 
    }
  }

  filterChampions(event: any){
    if (event) {
      this.filteredPeopleChamps = this.employeeRoles.filter((champs: any) =>
        champs.employee.name.toLowerCase().includes(event.target.value.toLowerCase())
      
      );
    } else {
      this.filteredPeopleChamps= this.employeeRoles.employee.name; 
    }
  }

  getId(data: any, name: string){
    if (name == 'employee'){
      this.employeeId = data.id
    }
    else if (name == 'client'){
      this.clientId = data.id
    }
    else if (name == 'champion'){
      this.peopleChampionId = data.employee.id
    }
  }
}
