import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { ChartService } from 'src/app/services/hris/charts.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData } from 'src/app/models/hris/charts.interface';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeCountDataCard } from 'src/app/models/hris/employee-count-data-card.interface';
import { ChurnRateDataCard } from 'src/app/models/hris/churn-rate-data-card.interface';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent {
  @ViewChild('dialogTemplate', { static: true })
  dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() expandSearch = new EventEmitter<string>();

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  categoryControl = new FormControl();
  chartName: string = '';
  chartType: any = '';
  chartData: number[] = [];
  categories: string[] = [];
  filteredCategories: string[] = this.categories;
  selectedCategories: string[] = [];
  noResults: boolean = false;
  typeControl = new FormControl();
  types: string[] = [];
  filteredTypes: any[] = this.types;
  selectedTypes: string[] = [];
  loadCounter: number = 0;
  isMobileScreen = false;
  totalNumberOfEmployees: number = 0;
  charts: ChartData[] = [];
  searchQuery: string = '';
  searchResults: EmployeeProfile[] = [];
  employeeProfiles: EmployeeProfile[] = [];
  allFlag: boolean = false;
  isLoading: boolean = true;
  isLoadingChart: boolean = false;

  PREVIOUS_PAGE: string = 'previousPage';

  employeeCount: EmployeeCountDataCard = new EmployeeCountDataCard();
  churnRate: ChurnRateDataCard = new ChurnRateDataCard();
  employeeType: EmployeeType = new EmployeeType();

  displayAllEmployees: boolean = false;
  roles: string[] = [];

  dataSource: MatTableDataSource<{
    Name: string;
    Position: string | undefined;
    Level: number | undefined;
    Client: string;
    Roles: string[];
    Email: string | undefined;
  }> = new MatTableDataSource();

  constructor(
    private employeeService: EmployeeService,
    private chartService: ChartService,
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private employeeTypeService: EmployeeTypeService,
    private navService: NavService,
    public authAccessService: AuthAccessService) {
    navService.showNavbar = true;
  }

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));
    if (this.authAccessService.isAdmin() ||
      this.authAccessService.isSuperAdmin() ||
      this.authAccessService.isTalent() ||
      this.authAccessService.isJourney()) {
      this.configureDashboardData();
    }
  }

  configureDashboardData() {
    this.getEmployeeProfiles();
    this.getCharts();
    this.getEmployeeTypes();
    this.getEmployeeTableColumns();
    this.getDataCardsData();

    this.categoryControl.valueChanges.subscribe((value) => {
      this.selectedCategories = value;
    });

    this.typeControl.valueChanges.subscribe((value) => {
      this.selectedTypes = value;
    });
  }

  getDataCardsData() {
    this.isLoading = false;
    this.employeeService.getTotalEmployees().subscribe({
      next: (data: number) => {
        this.totalNumberOfEmployees = data;
      },
    });

    this.employeeService.getEmployeeCountData().subscribe({
      next: (data: EmployeeCountDataCard) => {
        this.employeeCount = data;
      },
    });

    this.employeeService.getChurnRate().subscribe({
      next: (data: ChurnRateDataCard) => {
        this.churnRate = data;
      },
    });
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

  getEmployeeProfiles() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: (data: EmployeeProfile[]) => {
        this.employeeProfiles = data;
        this.searchResults = [];
      },
      error: () => {
        this.snackBarService.showSnackbar(
          'Failed to fetch employees',
          'snack-error'
        );
      },
      complete: () => {
        this.loadCounter++;
      },
    });
  }




  dummyChart(){
    const data = {
      labels: ['Race 1', 'Race 2', 'Race 3', 'Race 4'], // Races
      datasets: [
        {
          label: 'Developer',
          data: [10, 20, 15, 25], // Number of employees for each race
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // Bar color
        },
        {
          label: 'Designer',
          data: [15, 10, 20, 30],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Scrum Master',
          data: [5, 15, 10, 20],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
        {
          label: 'Support',
          data: [20, 25, 30, 35],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    };

    return data;
  }



  getCharts() {
    this.chartService.getAllCharts().subscribe({
      next: (data) => {
        this.charts = data;
        this.charts[0].data;
      },
      error: () => {
        this.snackBarService.showSnackbar(
          'Failed to fetch charts',
          'snack-error'
        );
      },
      complete: () => {
        this.loadCounter++;
      },
    });
  }

  getEmployeeTypes() {
    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
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
    return this.categories.filter((category) =>
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
    const categories = this.categoryControl.value;
    const index = categories.indexOf(category);
    if (index >= 0) {
      categories.splice(index, 1);
      this.categoryControl.setValue(categories);
    }
  }

  createChart() {
    if (!this.chartType) {
      this.snackBarService.showSnackbar(
        'Please select a chart type',
        'snack-error'
      );
      return;
    }
    if (!this.chartName) {
      this.snackBarService.showSnackbar(
        'Please enter a chart name',
        'snack-error'
      );
      return;
    }
    if (this.selectedCategories.length < 1) {
      this.snackBarService.showSnackbar(
        'Please select a category',
        'snack-error'
      );
      return;
    }
    if (this.selectedTypes.length < 1) {
      this.snackBarService.showSnackbar(
        'Please select at least one employee role',
        'snack-error'
      );
      return;
    }

    let combinedChartName = this.chartName;
    if (this.selectedTypes.length > 0) {
      combinedChartName += ` - ${this.selectedTypes.join(', ')}`;
    }
    this.isLoadingChart = true;
    this.loadCounter = 0;
    this.chartService
      .createChart(
        this.selectedCategories,
        this.selectedTypes,
        combinedChartName,
        this.chartType
      )
      .subscribe({
        next: () => {
          this.snackBarService.showSnackbar('Chart created', 'snack-success');
          this.dialog.closeAll();
          this.selectedCategories = [];
          this.selectedTypes = [];
          this.chartName = '';
          this.chartType = '';
          this.configureDashboardData();
          this.isLoadingChart = false;
        },
        error: () => {
          this.snackBarService.showSnackbar(
            'Failed to create chart',
            'snack-error'
          );
          this.isLoadingChart = false;
        },
      });
    this.selectedCategories = [];
    this.categoryControl.setValue(null);
    this.selectedTypes = [];
    this.typeControl.setValue(null);
  }

  activateSearchBar() {
    const searchBar = document.querySelector('.searchbar');
    searchBar?.classList.add('active');
    searchBar?.classList.remove('no-results');
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

  changeEmployeeRolesOnNewChart(event: any) {
    if (event.value.includes('All')) {
      if (
        event.value.length == this.types.length - 1 &&
        this.allFlag == false
      ) {
        this.allFlag = true;
        const newSelection = event.value.filter(
          (item: string) => item !== 'All'
        );
        this.typeControl.setValue(newSelection);
        this.selectedTypes = newSelection;
      } else if (event.value.length <= this.types.length - 1) {
        this.allFlag = false;
        this.typeControl.setValue([...this.types]);
        this.selectedTypes = [...this.types];
      }
    } else {
      const newSelection = event.value.filter((item: string) => item !== 'All');
      this.typeControl.setValue(newSelection);
      this.selectedTypes = newSelection;
    }
  }
}
