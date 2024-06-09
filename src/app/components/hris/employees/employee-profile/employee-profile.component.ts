import { Component, ChangeDetectorRef, ViewChild, HostListener, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { ClientService } from 'src/app/services/hris/client.service';
import { AccordionBankingComponent } from './accordions/accordion-banking/accordion-banking.component';
import { AccordionProfileAdditionalComponent } from './accordions/accordion-profile/accordion-profile-additional-details/accordion-profile-additional.component';
import { AccordionProfileAddressDetailsComponent } from './accordions/accordion-profile/accordion-profile-address-details/accordion-profile-address-details.component';
import { AccordionProfileContactDetailsComponent } from './accordions/accordion-profile/accordion-profile-contact-details/accordion-profile-contact-details.component';
import { AccordionProfileEmployeeDetailsComponent } from './accordions/accordion-profile/accordion-profile-employee-details/accordion-profile-employee-details.component';
import { AccordionProfilePersonalDetailsComponent } from './accordions/accordion-profile/accordion-profile-personal-details/accordion-profile-personal-details.component';
import { AccordionDocumentsComponent } from './accordions/accordion-documents/accordion-documents-starterkit/accordion-documents.component';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { SharedAccordionFunctionality } from './shared-accordion-functionality';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { AccordionDocumentsAdditionalComponent } from './accordions/accordion-documents/accordion-my-documents/accordion-my-documents.component';
import { AccordionAdministrativeDocumentsComponent } from './accordions/accordion-administrative-documents/accordion-administrative-documents.component';
import { AccordionEmployeeDocumentsComponent } from './accordions/accordion-employee-documents/accordion-employee-documents.component';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent implements OnChanges {
  @Input() updateProfile!: { updateProfile: SharedAccordionFunctionality };
  @Input() updateDocument!: { updateDocument: SharedAccordionFunctionality };
  @Input() updateCareer!: { updateCareer: SharedAccordionFunctionality };

  selectedEmployee!: EmployeeProfile;
  employeeProfile!: EmployeeProfile;
  simpleEmployee!: SimpleEmployee;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  customFields: CustomField[] = [];

  employeeBanking !: EmployeeBanking;

  employeeId = this.route.snapshot.params['id'];

  selectedAccordion: string = 'Profile Details';
  selectedItem: string = 'Profile Details';

  editContact: boolean = false;
  showBackButtons: boolean = true;
  isAdminUser: boolean = false;

  employeeClient!: EmployeeProfile;
  employeeTeamLead!: EmployeeProfile;
  employeePeopleChampion!: EmployeeProfile;

  profileFormProgress: number = 0;
  overallFormProgress: number = 0;
  documentFormProgress: number = 0;
  careerFormProgress: number = 0;
  bankingFormProgress: number = 0;
  bankInformationProgress: number = 0;
  documentsProgress: number = 0;
  uploadButtonIndex: number = 0;

  bankingPDFName: string = "";
  hasBankingData: boolean = false;
  employeeDocuments: EmployeeDocument[] = [];
  documentsFileName: string = "";
  clientId? = null;
  peopleChampionId = null;
  client: string = '';
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
  @ViewChild(AccordionProfileAddressDetailsComponent) adressAccordion!: AccordionProfileAddressDetailsComponent;
  @ViewChild(AccordionProfileAdditionalComponent) additionalAccordion!: AccordionProfileAdditionalComponent;
  @ViewChild(AccordionProfileContactDetailsComponent) contactAccordion!: AccordionProfileContactDetailsComponent;
  @ViewChild(AccordionProfileEmployeeDetailsComponent) employeeAccordion!: AccordionProfileEmployeeDetailsComponent;
  @ViewChild(AccordionProfilePersonalDetailsComponent) personalAccordion!: AccordionProfilePersonalDetailsComponent;
  @ViewChild(AccordionDocumentsComponent) starterKitAccordion!: AccordionDocumentsComponent;
  @ViewChild(AccordionDocumentsAdditionalComponent) additionalDocumentsAccordion!: AccordionDocumentsAdditionalComponent;
  @ViewChild(AccordionAdministrativeDocumentsComponent) adminDocumentsAccordion!: AccordionAdministrativeDocumentsComponent;
  @ViewChild(AccordionEmployeeDocumentsComponent) employeeDocumentAccordion!: AccordionEmployeeDocumentsComponent;

  imageUrl!: string;
  validateFile: any;
  snackBar: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    public navService: NavService,
    private changeDetectorRef: ChangeDetectorRef,
    private employeeDataService: EmployeeDataService,
    public authAccessService: AuthAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private clipboard: Clipboard) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes['updateProfile'].currentValue
    changes['updateDocument'].currentValue
  }

  ngOnDestroy() {
    this.displayEditButtons()
  }

  ngOnInit() {
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin() || this.authAccessService.isTalent()) {
      this.isAdminUser = true;
    }
    this.sharedAccordionFunctionality.updateProfile.subscribe({
      next: (data: number) => {
        this.profileFormProgress = data;
        this.overallProgress();
      }
    });

    this.sharedAccordionFunctionality.updateDocument.subscribe({
      next: (data: number) => {
        this.documentFormProgress = data;
        this.overallProgress();
      }
    });
    this.sharedAccordionFunctionality.updateCareer.subscribe({
      next: (data: number) => {
        this.careerFormProgress = data;
        this.overallProgress();
      }
    });

    this.employeeId = this.route.snapshot.params['id'];
    this.getClients();

    if (this.employeeId == undefined) {
      this.showBackButtons = false;
      this.employeeId = this.authAccessService.getUserId();
    }
    if (this.authAccessService.isAdmin() ||
      this.authAccessService.isSuperAdmin() ||
      this.authAccessService.isJourney() ||
      this.authAccessService.isTalent()) {
      this.usingSimpleProfile = false;
    }
    else {
      this.usingSimpleProfile = true;
    }

    this.getEmployeeProfile();
    this.refreshEmployeeProfile();
    this.previousPage = this.cookieService.get(this.PREVIOUS_PAGE);
  }

  openTerminationForm() {
    this.router.navigateByUrl('/end-employment/' + this.employeeId)
  }

  goToEmployees() {
    this.router.navigateByUrl('/employees')
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard')
  }

  getEmployeeData() {
    this.employeeDataService.getEmployeeData(this.employeeId).subscribe({
      next: data => {
        this.sharedAccordionFunctionality.employeeData = data;
      }
    });
  }

  getEmployeeProfile() {
    const fetchProfile = this.usingSimpleProfile
      ? this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail())
      : this.employeeProfileService.getEmployeeById(this.employeeId);

    (fetchProfile as any).subscribe({
      next: (data: any) => {
        if (this.usingSimpleProfile) {
          this.simpleEmployee = data;
          this.employeeProfile = data;
          this.employeeId = data.id;
          this.populateEmployeeAccordion(this.simpleEmployee);
        } else {
          this.selectedEmployee = data;
          this.employeeProfile = data;
        }
        this.getEmployeeFields();
        this.getEmployeeData();
        this.filterClients(this.employeeProfile.clientAllocated as number);
        this.isLoading = false;
      },
      complete: () => {
        this.changeDetectorRef.detectChanges();
      },
      error: (error: any) => {
        this.snackBarService.showSnackbar(error, 'snack-error');
      }
    })
  }

  getEmployeeFields() {
    const fetchProfile = this.usingSimpleProfile
      ? this.employeeProfileService.getSimpleEmployee(this.authAccessService.getEmployeeEmail())
      : this.employeeProfileService.getEmployeeById(this.employeeId);

    (fetchProfile as any).subscribe({
      next: (data: any) => {
        this.employeeProfile = data;
        this.selectedEmployee = data;
        this.employeePhysicalAddress = data.physicalAddress!;
        this.employeePostalAddress = data.postalAddress!;
        this.checkAddressMatch(data);
      },
      complete: () => {
        if (!this.usingSimpleProfile)
          this.getAllEmployees();
      },
      error: () => {
        const errorMessage = this.usingSimpleProfile ? 'Error fetching simple user profile' : 'Error fetching user profile';
        this.snackBarService.showSnackbar(errorMessage, 'snack-error');
      }
    })
  }

  getAllEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.employees = data;
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
        this.filterClients(this.employeeProfile?.clientAllocated as number);
      }
    });
  }

  get basedInString(): string {
    let basedIn = '';
    if (this.employeeProfile.physicalAddress !== undefined && this.employeeProfile.physicalAddress.suburbOrDistrict && this.employeeProfile.physicalAddress.suburbOrDistrict.length > 2) {
      basedIn = `Based in ${this.employeeProfile.physicalAddress.suburbOrDistrict}`;
    }
    return basedIn;
  }

  populateEmployeeAccordion(employee: SimpleEmployee) {
    Object.assign(this.employeeProfile, {
      clientAllocated: employee.clientAllocatedId,
      teamLead: employee.teamLeadId,
      peopleChampion: employee.peopleChampionId,
      physicalAddress: employee.physicalAddress,
      postalAddress: employee.postalAddress,
      cellphoneNo: employee.cellphoneNo,
      countryOfBirth: employee.countryOfBirth,
      dateOfBirth: employee.dateOfBirth,
      disability: employee.disability,
      disabilityNotes: employee.disabilityNotes,
      email: employee.email,
      emergencyContactName: employee.emergencyContactName,
      emergencyContactNo: employee.emergencyContactNo,
      employeeNumber: employee.employeeNumber,
      employeeType: employee.employeeType,
      engagementDate: employee.engagementDate,
      gender: employee.gender,
      houseNo: employee.houseNo,
      id: employee.id,
      idNumber: employee.idNumber,
      initials: employee.initials,
      leaveInterval: employee.leaveInterval,
      level: employee.level,
      name: employee.name,
      nationality: employee.nationality,
      notes: employee.notes,
      passportCountryIssue: employee.passportCountryIssue,
      passportExpirationDate: employee.passportExpirationDate,
      passportNumber: employee.passportNumber,
      payRate: employee.payRate,
      personalEmail: employee.personalEmail,
      photo: employee.photo,
      race: employee.race,
      salary: employee.salary,
      salaryDays: employee.salaryDays,
      surname: employee.surname,
      taxNumber: employee.taxNumber
    });
  }

  getClients() {
    this.clientService.getAllClients().subscribe({
      next: data => {
        this.clients = data;
      }
    })
  }

  filterClients(clientId: number) {
    this.employeeClient = this.clients.filter(client => +clientId == client.id)[0];
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem = target.innerText;
    this.selectedAccordion = target.innerText;
  }

  overallProgress() {
    this.overallFormProgress = Math.round((this.profileFormProgress + this.careerFormProgress + this.bankInformationProgress + this.documentFormProgress) / 4);
  }

  updateBankingProgress(update: any) {
    this.bankInformationProgress = update.progress;
    this.bankStatus = update.status;
    this.overallProgress();
  }

  updateProfileProgress() {
    this.getEmployeeProfile();
  }

  onFileChange(e: any) {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const file = new FileReader();
      file.readAsDataURL(e.target.files[0]);
      file.onload = (event: any) => {
        this.employeeProfile.photo = event.target.result;
        this.base64Image = event.target.result;
        this.updateUser();
      };
      file.onerror = (error) => {
        this.snackBarService.showSnackbar('Error uploading file', 'snack-error')
      }
    }
  }

  updateUser() {
    const updatedEmp = { ...this.employeeProfile, photo: this.base64Image };
    this.employeeService.updateEmployee(updatedEmp).subscribe({
      next: () => {
        this.getEmployeeProfile();
        this.snackBarService.showSnackbar('Updated your profile picture', 'snack-success');
        this.navService.refreshEmployee();
      },
      error: () => {
        this.snackBarService.showSnackbar('Failed to update employee profile picture', 'snack-error');
      }
    });
  }

  copyToClipboard() {
    let emailToCopy: string;
    if (this.simpleEmployee && this.simpleEmployee.email) {
      emailToCopy = this.simpleEmployee.email;
    } else if (this.employeeProfile && this.employeeProfile.email) {
      emailToCopy = this.employeeProfile.email;
    } else {
      this.snackBarService.showSnackbar("No email address available to copy", "snack-error");
      return;
    }
    this.clipboard.copy(emailToCopy);
    this.snackBarService.showSnackbar("Email copied to clipboard", "snack-success");
  }

  displayEditButtons() {
    this.sharedAccordionFunctionality.editEmployee = false;
    this.sharedAccordionFunctionality.editAdditional = false;
    this.sharedAccordionFunctionality.editAddress = false;
    this.sharedAccordionFunctionality.editContact = false;
    this.sharedAccordionFunctionality.editPersonal = false;
  }

  checkAddressMatch(data: EmployeeProfile) {
    var dataCopy: any = data;
    const stringifiedphysicalAddress = JSON.stringify(dataCopy.physicalAddress);
    const stringifiedpostalAddress = JSON.stringify(dataCopy.postalAddress);
    if (stringifiedphysicalAddress === stringifiedpostalAddress) {
      this.sharedAccordionFunctionality.physicalEqualPostal = true;
    }
  }

  refreshEmployeeProfile() {
    this.getEmployeeProfile();
    this.getEmployeeFields();
    if (this.authAccessService.isAdmin() || this.authAccessService.isSuperAdmin()) {
      this.getAllEmployees();
    }
    this.getClients();
  }
}
