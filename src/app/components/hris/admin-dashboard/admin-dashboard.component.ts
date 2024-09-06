import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Component, Output, EventEmitter, ViewChild, HostListener, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AccessPropertiesService } from 'src/app/services/hris/access-properties.service';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { ChartService } from 'src/app/services/hris/charts.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData } from 'src/app/models/hris/charts.interface';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeCountDataCard } from 'src/app/models/hris/employee-count-data-card.interface';
import { ChurnRateDataCard } from 'src/app/models/hris/churn-rate-data-card.interface';
import { DashboardService } from 'src/app/services/hris/employee/dashboard.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { SharedAccordionFunctionality } from '../employees/employee-profile/shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent implements OnInit {
  editChartSubscription: Subscription;

  categoryControl = new FormControl<string[]>([]);
  typeControl = new FormControl<string[]>([]);

  chartNameControl = new FormControl('', [
    Validators.required, Validators.minLength(5)
  ]);

  @ViewChild('dialogTemplate', { static: true })
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() expandSearch = new EventEmitter<string>();

  screenWidth = window.innerWidth;
  employeeId: number = -1;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  PREVIOUS_PAGE: string = 'previousPage';
  chartName: string = '';
  chartType: string = '';
  chartData: number[] = [];
  charts: ChartData[] = [];
  categories: string[] = [];
  chartCategory: string = '';
  chartRoles: string = '';
  filteredCategories: string[] = [];
  selectedCategories: string[] = [];
  types: string[] = [];
  filteredTypes: string[] = [];
  selectedTypes: string[] = [];
  employeeProfiles: EmployeeProfile[] = [];
  totalNumberOfActiveEmployees: number = 0;
  growthRate: number = 0;
  roles: string[] = [];
  searchQuery: string = '';
  searchResults: EmployeeProfile[] = [];
  svgWidth: number = 500;

  isMobileScreen = false;
  noResults: boolean = false;
  allFlag: boolean = false;
  isLoading: boolean = true;
  isLoadingChart: boolean = false;
  displayAllEmployees: boolean = false;
  loadCounter: number = 0;

  employeeCount: EmployeeCountDataCard = new EmployeeCountDataCard();
  churnRate: ChurnRateDataCard = new ChurnRateDataCard();
  employeeType: EmployeeType = new EmployeeType();

  dataSource: MatTableDataSource<{
    Name: string;
    Level: number | undefined;
    Client: string;
    Roles: string[];
    Email: string | undefined;
  }> = new MatTableDataSource();

  constructor(
    public accessPropertiesService: AccessPropertiesService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private dashboardService: DashboardService,
    public chartService: ChartService,
    private cookieService: CookieService,
    private router: Router,
    private employeeProfileService: EmployeeProfileService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private employeeTypeService: EmployeeTypeService,
    public authAccessService: AuthAccessService,
    private sharedPropertyAccessService: SharedPropertyAccessService) {
    this.editChartSubscription = this.chartService.getClickEvent().subscribe(() => {

      const activeChart = this.chartService.activeChart;
      if (activeChart) {
        this.chartType = activeChart.type;
        this.chartName = activeChart.name;
        this.selectedCategories = activeChart.dataTypes[0].replace("'", " ").split(",");
        this.selectedTypes = (activeChart.roles && activeChart.roles[0]) ? activeChart.roles[0].replace("'", " ").split(",") : [];
        this.categoryControl.disable();
        this.typeControl.disable();
        let dialogRef = this.dialog.open(this.dialogTemplate, {
          width: '500px',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.categoryControl.enable();
          this.typeControl.enable();
          this.chartService.isEditing = false;
          this.chartName = "";
          this.chartType = "";
          this.selectedCategories = [];
          this.selectedTypes = [];
        });
      }
    });
  }

  async ngOnInit() {
    this.roles = [this.authAccessService.getRole()];
    await this.getUserId();
    this.configureDashboardData();
    this.setSvgWidth();
  }

  ngOnDestroy() {
    this.editChartSubscription.unsubscribe()
  }

  setSvgWidth(): number {
    if (this.screenWidth < 768) {
      return this.svgWidth = 265;
    } else {
      return this.svgWidth = 500;
    }
  }

  async getUserId() {
    this.employeeId = this.authAccessService.getUserId()
    if (this.employeeId === -1) {
      const email = this.authAccessService.getEmployeeEmail();
      await this.sharedPropertyAccessService.setAccessProperties(email);
      this.employeeId = this.authAccessService.getUserId();
    }
  }

  configureDashboardData() {
    this.getAllEmployeeProfiles();
    this.getCharts();
    this.getEmployeeTypes();
    this.getEmployeeTableColumns();
    this.getDataCardsData();

    this.categoryControl.valueChanges.subscribe((value) => {
      this.selectedCategories = value || [];
    });

    this.typeControl.valueChanges.subscribe((value) => {
      this.selectedTypes = value || [];
    });
  }

  getDataCardsData() {
    this.isLoading = true;
    this.dashboardService.getActiveEmployeeCount().subscribe({
      next: (data: number) => {
        this.totalNumberOfActiveEmployees = data;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.dashboardService.getEmployeeCountData().subscribe({
      next: (data: EmployeeCountDataCard) => {
        this.employeeCount = data;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.dashboardService.getChurnRate().subscribe({
      next: (data: ChurnRateDataCard) => {
        this.churnRate = data;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.dashboardService.getGrowthrate().subscribe({
      next: (data: number) => {
        this.growthRate = data
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  getEmployeeTableColumns() {
    this.chartService.getEmployeeTableColumns().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = this.categories
          .slice()
          .sort((a, b) => a.localeCompare(b));
      },
      complete: () => {
        this.loadCounter++;
      },
    });
  }

  getAllEmployeeProfiles() {
    this.employeeProfileService.getAllEmployeeProfiles().subscribe({
      next: (data: EmployeeProfile[]) => {
        this.employeeProfiles = data;
        this.searchResults = [];
        this.sharedAccordionFunctionality.employees = data;
      },
      error: (er) => this.snackBarService.showError(er),
      complete: () => {
        this.loadCounter++;
      },
    });
  }

  getCharts() {
    var currentUserId = this.employeeId;
    if (currentUserId) {
      this.chartService.getEmployeeCharts(currentUserId).subscribe({
        next: (data) => {
          this.charts = data;
        },
        error: (er) => this.snackBarService.showError(er),
        complete: () => {
          this.loadCounter++;
        },
      });
    }
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.sharedAccordionFunctionality.employeeTypes = data;
        this.types = [];
        this.types.push('All');
        data.forEach((field) => this.types.push(field.name as string));
        this.filteredTypes = this.types;
      },
      complete: () => {
        this.loadCounter++;
      },
    });
  }

  showAddGraphModal() {
    this.chartNameControl.reset();
    this.categoryControl.reset();
    this.typeControl.reset();
    this.dialog.open(this.dialogTemplate, {
      width: '500px',
    });
  }

  AddEmployee() {
    this.cookieService.set(this.PREVIOUS_PAGE, '/dashboard');
    this.router.navigateByUrl('/create-employee');
  }

  viewMoreEmployees() {
    this.displayAllEmployees = true;
    this.cookieService.set('searchString', this.searchQuery);
    this.cookieService.set(this.PREVIOUS_PAGE, '/dashboard');
    this.router.navigateByUrl('/employees');
  }

  clearSearchField() {
    this.searchQuery = '';
  }

  searchEmployees() {
    if (this.searchQuery && this.searchQuery.length >= 3) {
      this.searchResults = this.employeeProfiles
        .filter(
          (employee) =>
            (employee.name &&
              employee.name
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase())) ||
            (employee.surname &&
              employee.surname
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase()))
        )
        .filter((employee) => employee.name !== undefined)
        .sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else {
            return 0;
          }
        });

      if (this.searchResults.length <= 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
        this.activateSearchBar();
      }
    } else {
      this.searchResults = [];
      this.noResults = true;
      this.deactivateSearchBar();
    }
    this.searchResults = this.searchResults.slice(0, 3);
  }

  filterCategories(val: string): string[] {
    return this.categories.filter(category =>
      category.toLowerCase().includes(val.toLowerCase())
    );
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  toggleSelection(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.categoryControl.setValue(null);
  }

  removeChartCategory(category: string): void {
    const categories: string[] = this.categoryControl.value || [];
    if (categories) {
      const index = categories.indexOf(category);
      if (index >= 0) {
        categories.splice(index, 1);
        this.categoryControl.setValue(categories);
      }
    }
  }

  createChart() {
    if (this.chartService.isEditing) {
      if (this.chartService.activeChart) {
        const updatedChart: ChartData = {
          ...this.chartService.activeChart,
          name: this.chartName,
          type: this.chartType,
        };
        this.chartService.updateChart(updatedChart).subscribe({
          next: () => {
            this.snackBarService.showSnackbar("Updated", "snack-success");
            this.chartService.isEditing = false
            this.dialog.closeAll();
          },
          error: (er) => this.snackBarService.showError(er),
        });
      }
      return
    }
    if (!this.chartType) {
      this.snackBarService.showSnackbar('Chart Type Required', 'snack-error');
      return;
    }
    if (!this.chartName) {
      this.snackBarService.showSnackbar('Chart Name Required', 'snack-error');
      return;
    }
    if (this.selectedCategories.length < 1) {
      this.snackBarService.showSnackbar('Category Required', 'snack-error');
      return;
    }
    if (this.selectedTypes.length < 1) {
      this.snackBarService.showSnackbar('Select at Least One Employee Role', 'snack-error');
      return;
    }
    this.isLoadingChart = true;
    this.loadCounter = 0;
    this.chartService
      .createChart(
        this.selectedCategories,
        this.selectedTypes,
        this.chartName,
        this.chartType,
        this.employeeId
      )
      .subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Created", "snack-success");
          this.dialog.closeAll();
          this.selectedCategories = [];
          this.selectedTypes = [];
          this.chartName = '';
          this.chartType = '';
          this.configureDashboardData();
          this.isLoadingChart = false;
        },
        error: (er) => {
          this.snackBarService.showError(er);
          this.isLoadingChart = false;
        },
      });
    this.selectedCategories = [];
    this.categoryControl.setValue(null);
    this.selectedTypes = [];
    this.typeControl.setValue(null);
    return
  }

  activateSearchBar() {
    const searchBar = document.querySelector('.searchbar');
    if (searchBar) {
      searchBar.classList.add('active');
      searchBar.classList.remove('no-results');
    }
  }

  deactivateSearchBar() {
    const searchBar = document.querySelector('.searchbar');
    searchBar?.classList.remove('active');
    searchBar?.classList.add('no-results');
  }

  sortRoles(roles: string[]): string[] {
    const adminRoles = roles
      .filter((role) => role.toLowerCase().includes('admin'))
      .sort()
      .reverse();
    const nonAdminRoles = roles
      .filter((role) => !role.toLowerCase().includes('admin'))
      .sort();
    return [...adminRoles, ...nonAdminRoles];
  }

  employeeClickEvent(employee: EmployeeProfile): void {
    this.selectedEmployee.emit(employee);
    this.cookieService.set(this.PREVIOUS_PAGE, '/dashboard');
    this.router.navigateByUrl('/profile/' + employee.id);
  }

  ViewUser(email: string) {
    this.cookieService.set('selectedUser', email);
  }

  onRoleRemoved(role: string): void {
    const currentRoles = this.typeControl.value || [];
    if (role === 'All') {
      this.typeControl.setValue([]);
      this.selectedTypes = [];
      this.allFlag = false;
    } else {
      const index = currentRoles.indexOf(role);
      if (index >= 0) {
        currentRoles.splice(index, 1);
        if (currentRoles.includes('All')) {
          const newSelection = currentRoles.filter(
            (item: string) => item !== 'All'
          );
          this.typeControl.setValue(newSelection);
          this.selectedTypes = newSelection;
          this.allFlag = false;
        } else {
          this.typeControl.setValue(currentRoles);
          this.selectedTypes = currentRoles;
        }
      }
    }
  }

  onCategoryChange(event: any) {
    this.selectedCategories = event.value;
  }

  changeEmployeeRolesOnNewChart(event: any) {
    const selectedValues: string[] = event.value;
    if (selectedValues.includes('All')) {
      if (selectedValues.length === this.types.length - 1 && !this.allFlag) {
        this.allFlag = true;
        const newSelection: string[] = selectedValues.filter((item: string) => item !== 'All');
        this.typeControl.setValue(newSelection);
        this.selectedTypes = newSelection;
      } else if (selectedValues.length <= this.types.length - 1) {
        this.allFlag = false;
        this.typeControl.setValue([...this.types]);
        this.selectedTypes = [...this.types];
      }
    } else {
      const newSelection: string[] = selectedValues.filter((item: string) => item !== 'All');
      this.typeControl.setValue(newSelection);
      this.selectedTypes = newSelection;
    }
  }

  clearAddGraphFields() {
    this.typeControl.setValue([]);
    this.categoryControl.setValue([]);
    this.chartName = '';
    this.chartType = '';
    this.types = [];
    this.dialog.closeAll()
    this.chartService.isEditing = false;
  }
}
