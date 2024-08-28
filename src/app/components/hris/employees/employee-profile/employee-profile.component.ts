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
import { Clipboard } from '@angular/cdk/clipboard';
import { SharedAccordionFunctionality } from './shared-accordion-functionality';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { AccordionDocumentsAdditionalComponent } from './accordions/accordion-documents/accordion-my-documents/accordion-my-documents.component';
import { AccordionAdministrativeDocumentsComponent } from './accordions/accordion-documents/accordion-administrative-documents/accordion-administrative-documents.component';
import { AccordionEmployeeDocumentsComponent } from './accordions/accordion-documents/accordion-employee-documents/accordion-employee-documents.component';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { EmployeeTerminationService } from 'src/app/services/hris/employee/employee-termination.service';
import { EmployeeTermination } from 'src/app/models/hris/employeeTermination.interface';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/services/hris/client.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import * as pako from 'pako'; 
import { ImageProcessingService } from 'src/app/services/hris/image-processing.service';

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
  employeePhysicalAddress !: EmployeeAddress;
  terminationData !: EmployeeTermination
  clients: Client[] = [];
  employees: EmployeeProfile[] = [];
  customFields: CustomField[] = [];
  employeeBanking !: EmployeeBanking;

  employeeId: any;

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
    private clientService: ClientService,
    private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
    private employeeTerminationService: EmployeeTerminationService,
    public navService: NavService,
    private changeDetectorRef: ChangeDetectorRef,
    private employeeDataService: EmployeeDataService,
    public authAccessService: AuthAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private sharedPropertyAccessService: SharedPropertyAccessService,
    private clipboard: Clipboard,
    private imageProcessingService: ImageProcessingService 
  ) { }

  async getUserId() {
    this.employeeId = this.route.snapshot.params['id'] ?? this.authAccessService.getUserId();
    if (this.employeeId === -1) {
      this.showBackButtons = false;
      const email = this.authAccessService.getEmployeeEmail();
      await this.sharedPropertyAccessService.setAccessProperties(email);
      this.employeeId = this.authAccessService.getUserId();
    }
  }

  setDefaultTerminationStatus() {
    const defaultTerminationData: EmployeeTermination = {
      id: 0,
      employeeId: this.employeeId,
      terminationOption: 0,
      dayOfNotice: '',
      lastDayOfEmployment: '',
      reemploymentStatus: false,
      equipmentStatus: false,
      accountsStatus: false,
      terminationDocument: '',
      documentName: '',
      terminationComments: ''
    };
    this.terminationData = { ...defaultTerminationData };
  }

  setDefaultAddress() {
    const defaultEmployeeAddress: EmployeeAddress = {
      id: 0,
      unitNumber: '',
      complexName: '',
      streetName: '',
      streetNumber: '',
      suburbOrDistrict: '',
      city: '',
      country: '',
      province: '',
      postalCode: '',
      employeeId: this.employeeId
    };
    this.employeePhysicalAddress = { ...defaultEmployeeAddress };
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes['updateProfile'].currentValue
    changes['updateDocument'].currentValue
  }

  async ngOnInit() {
    await this.getUserId();
    this.setDefaultTerminationStatus();
    this.setDefaultAddress();

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

    this.getClients();

    this.getEmployeeProfile();
    this.previousPage = this.cookieService.get(this.PREVIOUS_PAGE);
  }

  getTeamLead() {
    if (this.employeeProfile.teamLeadName) {
      return `${this.employeeProfile.teamLeadName}`;
    }
    return 'Not assigned';
  }

  getPeopleChampion() {
    if (this.employeeProfile.peopleChampionName) {
      return `${this.employeeProfile.peopleChampionName}`;
    }
    return 'Not assigned';
  }

  getClientAllocated() {
    if (this.employeeProfile.clientAllocatedName) {
      return this.employeeProfile.clientAllocatedName;
    }
    return 'None';
  }

  getStartDate(): string {
    if (this.selectedEmployee?.engagementDate) {
      return new Date(this.selectedEmployee.engagementDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    return 'N/A';
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
        this.sharedAccordionFunctionality.employeeData = Array.isArray(data) ? data : [data];
      }
    });
  }

  getTerminationInfo(): void {
    this.employeeTerminationService.getTerminationDetails(this.selectedEmployee.id).subscribe({
      next: (data: EmployeeTermination) => {
        if (data)
          this.terminationData = data
      },
      error: (er) => { },
    });
  }

  isMainProfile() {
    const selectedUrl = this.router.url;
    const mainUserId = this.authAccessService.getUserId();
    const mainProfileUrl = '/profile';
    const profileUrlWithId = `/profile/${mainUserId}`;
    var isMainProfile = selectedUrl === mainProfileUrl || selectedUrl === profileUrlWithId
    return isMainProfile;
  }

  getProfileImage(): string {
    const employeePhoto = this.employeeProfile.photo;
  
    if (employeePhoto && employeePhoto.trim() !== '') {
      if (this.isMainProfile())
        this.sharedAccordionFunctionality.mainProfileImage = employeePhoto;
      
      return employeePhoto;
    }
  
    if (this.isMainProfile()) {
      const tokenPhoto = this.authAccessService.getAuthTokenProfilePicture();
      if (tokenPhoto && tokenPhoto.trim() !== '') {
        return tokenPhoto;
      }
    }
    return this.sharedAccordionFunctionality.defaultProfileImage;
  }

  getEmployeeProfile() {
    var identifier: any = this.router.url.substring(9)
    if(this.isMainProfile())
        identifier = this.employeeId;

    const fetchProfile = this.employeeProfileService.getEmployeeProfile(identifier);

    (fetchProfile as any).subscribe({
      next: (data: any) => {
        this.handleProfileData(data);
      },
      complete: () => {
        this.handleProfileComplete();
      },
      error: (er: any) => { }
    });
  }

  private handleProfileData(data: any) {
      this.setProfiles(data);
      this.filterClients(data.clientAllocated as number);
      this.sharedAccordionFunctionality.employeePhysicalAddress = data?.physicalAddress || this.employeePhysicalAddress;
  }

  setProfiles(data: any) {
    this.employeeProfile = { ...data };
    this.selectedEmployee = { ...data };
    this.sharedAccordionFunctionality.selectedEmployee = { ...data };
    this.getEmployeeData();
    this.isLoading = false;
  }

  private isValidDate(date: any): boolean {
    if (date === null || date === undefined || date === '') {
      return false;
    }
    const parsedDate = new Date(date);
    const today = new Date();
    return parsedDate < today;
  }

  private handleProfileComplete() {
    this.employeeProfile.active = true;

    if (this.isValidDate(this.employeeProfile.terminationDate)) {
      this.getTerminationInfo();
      this.employeeProfile.active = false;
    }
    this.getAllEmployees();
    this.changeDetectorRef.detectChanges();
  }

  getAllEmployees() {
    this.employees = this.sharedAccordionFunctionality.employees;
    this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLeadId)[0];
    this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampionId)[0];
    this.filterClients(this.employeeProfile?.clientAllocatedId as number);
  }

  get basedInString(): string {
    let basedIn = '';
    if (this.sharedAccordionFunctionality.employeePhysicalAddress !== undefined && this.sharedAccordionFunctionality.employeePhysicalAddress.suburbOrDistrict && this.sharedAccordionFunctionality.employeePhysicalAddress.suburbOrDistrict.length > 2) {
      basedIn = `Based in ${this.sharedAccordionFunctionality.employeePhysicalAddress.city}`;
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

  getClients() {
    this.clientService.getAllClients().subscribe({
      next: data => {
        this.sharedAccordionFunctionality.clients = data;
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

  // Example usage: compress and save the image
  onFileChange(event: any) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.base64Image = base64Image;

        // Compress the image
        const compressedImage = this.imageProcessingService.compressImage(this.base64Image);
        console.log("compressedImage.length",compressedImage.length)

        const decompressedImage = this.imageProcessingService.decompressImage(compressedImage);
        console.log("decompressedImage.length",decompressedImage.length)

        // Save or upload the compressed image as needed
        this.uploadCompressedImage(compressedImage);
      };
    }
  }

  uploadCompressedImage(compressedImage: Uint8Array) {
    //Note we need to use the compressed image after the backend changes to Uint8Array
    const decompressedImage = this.imageProcessingService.decompressImage(compressedImage);
    
    // Save the decompressed image (or directly use compressed data for further processing)
    const updatedEmployeeloyee = { ...this.employeeProfile, photo: decompressedImage };
    this.employeeProfileService.updateEmployeeProfile(updatedEmployeeloyee).subscribe({
      next: () => {
        console.log('Profile photo updated successfully.');
      },
      error: (error) => {
        console.error('Error updating profile photo:', error);
      }
    });
  }

  copyToClipboard() {
    let emailToCopy: string;
    if (this.employeeProfile && this.employeeProfile.email) {
      emailToCopy = this.employeeProfile.email;
    } else {
      this.snackBarService.showSnackbar("No Email Address Available to Copy", "snack-error");
      return;
    }
    this.clipboard.copy(emailToCopy);
    this.snackBarService.showSnackbar("Copied to Clipboard", "snack-success");
  }

  ViewCVDocument() {
    this.router.navigateByUrl('/view-cv-document/' + this.employeeId);
  }
}
