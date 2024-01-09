import { Component, ChangeDetectorRef,ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent {
  selectedEmployee!: EmployeeProfile;
  employeeProfile!: EmployeeProfile;
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

  PREVIOUS_PAGE = "previousPage";
  bankStatus: number = 0;

  @ViewChild(AccordionBankingComponent) bankingAccordion !: AccordionBankingComponent;
  @ViewChild(AccordionProfileComponent) profileAccordion!: AccordionProfileComponent;
  @ViewChild(AccordionDocumentsComponent) documentAccordion!: AccordionDocumentsComponent;

  constructor(private cookieService: CookieService,
    private employeeProfileService: EmployeeProfileService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBarService: SnackbarService,
    private navService: HideNavService,
    private changeDetectorRef: ChangeDetectorRef,) {
    navService.showNavbar = true;
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId == undefined) {
      this.showBackButtons = false;
      this.employeeId = this.cookieService.get('userId');
    }
    this.getSelectedEmployee();
    this.previousPage = this.cookieService.get(this.PREVIOUS_PAGE);
  }

  goToEmployees() {
    this.router.navigateByUrl('/employees')
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard')
  }

  getSelectedEmployee() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: (employee: any) => {
        this.selectedEmployee = employee;
        this.employeeProfile = employee;
        this.getEmployeeFields();
      },
      error: (error) => {
        this.snackBarService.showSnackbar(error, "snack-error");
      }
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
      },error: () => {
        this.snackBarService.showSnackbar("Error fetching user profile", "snack-error");
      }
    })
  }

  getAllEmployees() {
    this.employeeService.getAllProfiles().subscribe({
      next: data => {
        this.employees = data;
        this.employeeTeamLead = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.teamLead)[0];
        this.employeePeopleChampion = this.employees.filter((employee: EmployeeProfile) => employee.id === this.employeeProfile?.peopleChampion)[0];
        this.clientService.getAllClients().subscribe({
          next: data => {
            this.clients = data;
            this.employeeClient = this.clients.filter((client: any) => client.id === this.employeeProfile?.clientAllocated)[0];
          }, complete: () => {
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    });
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
    this.getSelectedEmployee();
  }
}
