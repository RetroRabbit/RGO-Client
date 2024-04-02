import { Component, ChangeDetectorRef, ViewChild, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { Client } from 'src/app/models/hris/client.interface';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { Document } from 'src/app/models/hris/constants/documents.contants';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ClientService } from 'src/app/services/hris/client.service';
import { AccordionBankingComponent } from './accordions/accordion-banking/accordion-banking.component';
// import { AccordionProfileComponent } from './accordions/accordion-profile/accordion-profile.component';
import { AccordionProfileAdditionalComponent } from './accordions/accordion-profile/accordion-profile-additional-details/accordion-profile-additional.component';
import { AccordionProfileAddressDetailsComponent } from './accordions/accordion-profile/accordion-profile-address-details/accordion-profile-address-details.component';
import { AccordionProfileContactDetailsComponent } from './accordions/accordion-profile/accordion-profile-contact-details/accordion-profile-contact-details.component';
import { AccordionProfileEmployeeDetailsComponent } from './accordions/accordion-profile/accordion-profile-employee-details/accordion-profile-employee-details.component';
import { AccordionProfilePersonalDetailsComponent } from './accordions/accordion-profile/accordion-profile-personal-details/accordion-profile-personal-details.component';
import { AccordionDocumentsComponent } from './accordions/accordion-documents/accordion-documents.component';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from './shared-accordion-functionality';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent {
  @Input('updateProfile') updateProfile: number | undefined;

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
  base64Image: string = '';
  screenWidth = window.innerWidth;

  @ViewChild(AccordionBankingComponent) bankingAccordion !: AccordionBankingComponent;
  // @ViewChild(AccordionProfileComponent) profileAccordion!: AccordionProfileComponent;
  @ViewChild(AccordionProfileAddressDetailsComponent) adressAccordion!: AccordionProfileAddressDetailsComponent;
  @ViewChild(AccordionProfileAdditionalComponent) additionalAccordion!: AccordionProfileAdditionalComponent;
  @ViewChild(AccordionProfileContactDetailsComponent) contactAccordion!: AccordionProfileContactDetailsComponent;
  @ViewChild(AccordionProfileEmployeeDetailsComponent) employeeAccordion!: AccordionProfileEmployeeDetailsComponent;
  @ViewChild(AccordionProfilePersonalDetailsComponent) personalAccordion!: AccordionProfilePersonalDetailsComponent;
  @ViewChild(AccordionDocumentsComponent) documentAccordion!: AccordionDocumentsComponent;

  imageUrl!: string;
  validateFile: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private navService: NavService,
    private changeDetectorRef: ChangeDetectorRef,
    public authAccessService: AuthAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
    navService.showNavbar = true;
  }
  // ngOnChanges() {
  //   console.log("Total profile progress", this.updateProfile);

  // }
  ngOnInit() {


    this.sharedAccordionFunctionality.updateProfile.subscribe(progress => {

      this.profileFormProgress = progress;
      this.overallProgress();
    });

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

  updateProfileProgress() {


    if (this.authAccessService.isAdmin() || this.authAccessService.isTalent() || this.authAccessService.isJourney())
      this.getSelectedEmployee();
    else
      this.getSimpleEmployee();
  }

  onFileChange(e: any) {
    if (e.target.files) {
      const file = new FileReader();
      file.readAsDataURL(e.target.files[0]);
      file.onload = (event: any) => {
        this.employeeProfile.photo = event.target.result;
        this.base64Image = event.target.result;
        this.updateUser();
      }
    }
  }

  updateUser() {
    let updatedEmp = { ...this.employeeProfile };

    updatedEmp.photo = this.base64Image;

    this.employeeService.updateEmployee(updatedEmp)
      .subscribe({
        next: () => {
          this.getSelectedEmployee()
        },
        error: () => {
          this.snackBarService.showSnackbar("Failed to update employee profile picture", "snack-error");
        }
      });
  }

}
