import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Client } from 'src/app/models/client.interface';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAddress } from 'src/app/models/employee-address.interface';
import { EmployeeData } from 'src/app/models/employee-data.interface';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/employeeDocument.interface';
import { Document } from 'src/app/models/constants/documents.contants';
import { HideNavService } from 'src/app/services/hide-nav.service';
import { ClientService } from 'src/app/services/client.service';
import { AccordionBankingComponent } from './accordions/accordion-banking/accordion-banking.component';
import { AccordionProfileComponent } from './accordions/accordion-profile/accordion-profile.component';
import { AccordionDocumentsComponent } from './accordions/accordion-documents/accordion-documents.component';
import { AuthAccessService } from 'src/app/services/auth-access.service';
import { SimpleEmployee } from 'src/app/models/simple-employee-profile.interface';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent {
  selectedEmployee!: EmployeeProfile;
  employeeProfile!: EmployeeProfile;
  simpleEmployee!: SimpleEmployee;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  employeeBanking !: EmployeeBanking;

  employeeId = this.route.snapshot.params['id'];

  selectedAccordion: string = 'Profile Details';
  selectedItem: string = 'Profile Details';
  fileCategories = Document;

  editContact: boolean = false;
  showBackButtons: boolean = true;

  employeeClient!: EmployeeProfile;
  employeeTeamLead!: EmployeeProfile;
  employeePeopleChampion!: EmployeeProfile;
  profileFormProgress: number = 0;
  overallFormProgress: number = 0;
  documentFormProgress: number = 0;
  bankingFormProgress: number = 0;
  bankInformationProgress: number = 0;
  documentsProgress: number = 0;
  bankingPDFName: string = "";
  hasBankingData: boolean = false;
  employeeDocuments: EmployeeDocument[] = [];
  uploadButtonIndex: number = 0;
  documentsFileName: string = "";
  clientId? = null;
  peopleChampionId = null;
  client: string = '';
  employeeDataDto!: EmployeeData;
  previousPage: string = '';
  currentPage: string = '';

  isLoading: boolean = true;
  usingSimpleProfile: boolean = false;
  teamLead: number | null = null;
  PREVIOUS_PAGE = "previousPage";
  bankStatus: number = 0;

  @ViewChild(AccordionBankingComponent) bankingAccordion !: AccordionBankingComponent;
  @ViewChild(AccordionProfileComponent) profileAccordion!: AccordionProfileComponent;
  @ViewChild(AccordionDocumentsComponent) documentAccordion!: AccordionDocumentsComponent;

  validateFile: any;
  imageUrl!: string;

  constructor(private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private navService: HideNavService,
    private changeDetectorRef: ChangeDetectorRef,
    public authAccessService: AuthAccessService) {
    navService.showNavbar = true;
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    this.getClients();
    if (this.employeeId == undefined) {
      this.showBackButtons = false;
      this.employeeId = this.cookieService.get('userId');
    }
    if (this.authAccessService.isAdmin() ||
      this.authAccessService.isSuperAdmin() ||
      this.authAccessService.isJourney() ||
      this.authAccessService.isTalent()) {
      this.getSelectedEmployee();
      this.usingSimpleProfile = false;
    }
    else {
      this.getSimpleEmployee();
      this.usingSimpleProfile = true;
    }
    this.previousPage = this.cookieService.get(this.PREVIOUS_PAGE);
  }

  goToEmployees() {
    this.router.navigateByUrl('/employees')
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard')
  }

  getSimpleEmployee() {

    this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail()).subscribe({
      next: data => {
        this.simpleEmployee = data;
        this.employeePhysicalAddress = this.simpleEmployee.physicalAddress!;
        this.employeePostalAddress = this.simpleEmployee.postalAddress!;
        this.filterClients(this.simpleEmployee?.clientAllocatedName as string);
        this.isLoading = false;
      }, complete: () => {
        this.populateEmployeeAccordion(this.simpleEmployee);
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  getSelectedEmployee() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: (employee: any) => {
        this.selectedEmployee = employee;
        this.employeeProfile = employee;
        this.getEmployeeFields();
        this.filterClients(this.employeeProfile.clientAllocated as string)
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error, "snack-error");
      },
      complete: () => this.changeDetectorRef.detectChanges()
    })
  }

  getEmployeeFields() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: data => {
        this.employeeProfile = data;
        this.employeePhysicalAddress = data.physicalAddress!;
        this.employeePostalAddress = data.postalAddress!;
      }, complete: () => {
        this.getAllEmployees();
      }, error: () => {
        this.snackBarService.showSnackbar("Error fetching user profile", "snack-error");
      }
    })
  }

  getAllEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.employees = data;
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
        this.filterClients(this.employeeProfile?.clientAllocated as string);
      }
    });
  }

  populateEmployeeAccordion(employee: SimpleEmployee) {
    this.employeeProfile = {};
    this.employeeProfile.cellphoneNo = employee.cellphoneNo;
    this.employeeProfile.clientAllocated = employee.clientAllocatedName;
    this.employeeProfile.countryOfBirth = employee.countryOfBirth;
    this.employeeProfile.dateOfBirth = employee.dateOfBirth;
    this.employeeProfile.disability = employee.disability;
    this.employeeProfile.disabilityNotes = employee.disabilityNotes;
    this.employeeProfile.email = employee.email;
    this.employeeProfile.emergencyContactName = employee.emergencyContactName;
    this.employeeProfile.emergencyContactNo = employee.emergencyContactNo;
    this.employeeProfile.employeeNumber = employee.employeeNumber;
    this.employeeProfile.employeeType = employee.employeeType;
    this.employeeProfile.engagementDate = employee.engagementDate;
    this.employeeProfile.gender = employee.gender;
    this.employeeProfile.houseNo = employee.houseNo;
    this.employeeProfile.id = employee.id;
    this.employeeProfile.idNumber = employee.idNumber;
    this.employeeProfile.initials = employee.initials;
    this.employeeProfile.leaveInterval = employee.leaveInterval;
    this.employeeProfile.level = employee.level;
    this.employeeProfile.name = employee.name;
    this.employeeProfile.nationality = employee.nationality;
    this.employeeProfile.notes = employee.notes;
    this.employeeProfile.passportCountryIssue = employee.passportCountryIssue;
    this.employeeProfile.passportExpirationDate = employee.passportExpirationDate;
    this.employeeProfile.passportNumber = employee.passportNumber;
    this.employeeProfile.payRate = employee.payRate;
    this.employeeProfile.peopleChampion = employee.peopleChampionId;
    this.employeeProfile.personalEmail = employee.personalEmail;
    this.employeeProfile.photo = employee.photo;
    this.employeeProfile.physicalAddress = employee.physicalAddress;
    this.employeeProfile.postalAddress = employee.postalAddress;
    this.employeeProfile.race = employee.race;
    this.employeeProfile.salary = employee.salary;
    this.employeeProfile.salaryDays = employee.salaryDays;
    this.employeeProfile.surname = employee.surname;
    this.employeeProfile.taxNumber = employee.taxNumber;
    this.employeeProfile.teamLead = employee.teamLeadId;
  }

  getClients() {
    this.clientService.getAllClients().subscribe({
      next: data => {
        this.clients = data;
      }
    })
  }

  filterClients(clientId: string) {
    this.employeeClient = this.clients.filter(client => +clientId == client.id)[0];
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
    this.selectedAccordion = target.innerText;
  }

  overallProgress() {
    this.overallFormProgress = Math.round((0.33 * this.profileFormProgress) + (0.33 * this.bankInformationProgress) + (0.33 * this.documentFormProgress));
  }

  updateBankingProgress(update: any) {
    this.bankInformationProgress = update.progress;
    this.bankStatus = update.status;
    this.overallProgress();
  }

  updateDocumentProgress(progress: number) {
    this.documentFormProgress = progress;
    this.overallProgress();
  }

  updateProfileProgress(progress: any) {
    this.profileFormProgress = progress;
    this.overallProgress();
    if (this.authAccessService.isAdmin() || this.authAccessService.isTalent() || this.authAccessService.isJourney())
      this.getSelectedEmployee();
    else
      this.getSimpleEmployee();
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.employeeProfile.photo = file;
      if(this.validateFile) {
        this.imageUrl = file;
      }else{
        this.uploadFile();
      }
    }
  }
  uploadFile() {
    throw new Error('');
  }
}
