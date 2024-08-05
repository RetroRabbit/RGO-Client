import { Component, ChangeDetectorRef, ViewChild, HostListener, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { Client } from 'src/app/models/hris/client.interface';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
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
import { AccordionAdministrativeDocumentsComponent } from './accordions/accordion-documents/accordion-administrative-documents/accordion-administrative-documents.component';
import { AccordionEmployeeDocumentsComponent } from './accordions/accordion-documents/accordion-employee-documents/accordion-employee-documents.component';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { EmployeeTerminationService } from 'src/app/services/hris/employee/employee-termination.service';
import { EmployeeTermination } from 'src/app/models/hris/employeeTermination.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';
import { Observable, Subscription } from 'rxjs';

import { LoadClients, SetClients } from 'src/app/components/shared-components/store/actions/client.actions';
import { NewEmployeeProfileService } from 'src/app/services/hris/employee/newEmployeeprofile.service';

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
  terminationData !: EmployeeTermination
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

  employeeClient!: Client;
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
  base64String: string = "";

  isLoading: boolean = true;
  usingSimpleProfile: boolean = false;
  teamLead: number | null = null;
  PREVIOUS_PAGE = "previousPage";
  bankStatus: number = 0;
  base64Image: string = '';
  screenWidth = window.innerWidth;
  profileSubscription: Subscription | undefined;

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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private store: Store<AppState>,
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private newEmployeeProfileService : NewEmployeeProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
    private employeeTerminationService: EmployeeTerminationService,
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

    if (this.authAccessService.isSupport()) {
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

  getTerminationInfo(): void {
    this.employeeTerminationService.getTerminationDetails(this.selectedEmployee.id).subscribe({
      next: (data: EmployeeTermination) => {
        this.terminationData = data;
      },
      error: (er) => this.snackBarService.showError(er),
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
        if (!this.employeeProfile.active) {
          this.getTerminationInfo();
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (er: any) => this.snackBarService.showError(er),
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
      error: (er: any) => this.snackBarService.showError(er),
    })
  }

  getAllEmployees() {
    this.employeeProfileService.getEmployeeProfiles().subscribe({
      next: data => {
        this.employees = data;
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
        this.filterClients(this.employeeProfile?.clientAllocated as number);
      }
    });
  }

  get basedInString(): string {
    let basedIn = '';
    if (this.employeeProfile.physicalAddress !== undefined && this.employeeProfile.physicalAddress.suburbOrDistrict && this.employeeProfile.physicalAddress.suburbOrDistrict.length > 2) {
      basedIn = `Based in ${this.employeeProfile.physicalAddress.city}`;
    }
    return basedIn;
  }

  downloadFile(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');
    if (commaIndex !== -1) {
      base64String = base64String.slice(commaIndex + 1);
    }
    const byteString = atob(base64String);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
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
    // Note for developer:
    this.store.dispatch(LoadClients());

    // Both of these methods do the same thing, load just includes the req.
    // this.clientService.getAllClients().subscribe({
    //   next: data => {
    //     this.clients = data;
    //     this.store.dispatch(SetClients({ payload: data }));
    //   }
    // })

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
        this.snackBarService.showSnackbar('Unable to Upload File', 'snack-error')
      }
    }
  }

  updateUser() {
    const updatedEmp = { ...this.employeeProfile, photo: this.base64Image };
    this.employeeProfileService.updateEmployee(updatedEmp).subscribe({
      next: () => {
        this.getEmployeeProfile();
        this.snackBarService.showSnackbar("Updated", "snack-success");
        this.navService.refreshEmployee();
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  copyToClipboard() {
    let emailToCopy: string;
    if (this.simpleEmployee && this.simpleEmployee.email) {
      emailToCopy = this.simpleEmployee.email;
    } else if (this.employeeProfile && this.employeeProfile.email) {
      emailToCopy = this.employeeProfile.email;
    } else {
      this.snackBarService.showSnackbar("No Email Address Available to Copy", "snack-error");
      return;
    }
    this.clipboard.copy(emailToCopy);
    this.snackBarService.showSnackbar("Copied to Clipboard", "snack-success");
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
  }

  ViewCVDocument() {
    this.router.navigateByUrl('/view-cv-document/' + this.selectedEmployee.id);
  }
}
