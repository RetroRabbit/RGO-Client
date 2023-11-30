import { Component, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeProfileService } from 'src/app/services/employee/employee-profile.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Router } from '@angular/router';
import { Observable, catchError, first, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { NgToastService } from 'ng-angular-popup';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeType } from 'src/app/models/employee-type.model';
import { HideNavService } from 'src/app/services/hide-nav.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() expandSearch = new EventEmitter<string>();

  categoryControl = new FormControl();
  chartName: string = '';
  selectedDataItems: string[] = [];
  chartType: any = '';
  chartData: number[] = [];
  chartLabels: string[] = [];
  categories: string[] = [];
  filteredCategories: string[] = this.categories;
  categoryCtrl = new FormControl();
  selectedCategories: string[] = [];
  noResults: boolean = false;
  typeControl = new FormControl();
  types: string[] = [];
  filteredTypes: any[] = this.types;
  selectedTypes: string[] = [];

  @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
  charts: Chart[] = [];
  public showModal: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  profileImage: string | null = null;
  initialDisplayCount: number = 3;
  displayAllEmployees: boolean = false;
  roles: string[] = [];


  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };

  searchQuery: string = '';
  searchResults: EmployeeProfile[] = [];
  allEmployees: EmployeeProfile[] = [];

  CURRENT_PAGE = "currentPage";
  PREVIOUS_PAGE = "previousPage";

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private toast: NgToastService,
    private chartService: ChartService,
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private employeeTypeService: EmployeeTypeService,
    private hideNavService: HideNavService
  ) {}

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));
    this.employeeService.getAllProfiles().subscribe((data) => {
      if (Array.isArray(data)) {
        this.allEmployees = data;
      } else if (data) {
        this.allEmployees = [data];
      }
      this.searchResults = [];
    });

    this.employeeProfileService
      .searchEmployees(this.searchQuery)
      .subscribe((data) => {
        this.allEmployees = data;
    });

    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
      error: (error) => {
        this.snackBarService.showSnackbar("Failed to fetch charts", "snack-error");
      }
    });

    this.categoryControl.valueChanges.subscribe(val => {
      this.selectedCategories = val;
    });

    this.typeControl.valueChanges.subscribe(val => {
      this.selectedTypes = val;
    });

    this.chartService.getColumns().subscribe({
      next: data => {
        this.categories = data;
        this.filteredCategories = this.categories.slice().sort((a, b) => a.localeCompare(b));
      }
    });

    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.types = data.map(type => type.name || '');
        this.filteredTypes = this.types;
      }
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  CaptureEventOld(event: any) {
    this.cookieService.set(this.CURRENT_PAGE, "+ Add Graph");
  }

  CaptureEvent(event: any) {
    let dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '500px'
    });
  }

  AddNewHire(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set(this.PREVIOUS_PAGE, 'Dashboard');
    this.cookieService.set(this.CURRENT_PAGE, target.innerText);
    this.router.navigateByUrl('/create-employee');

  }

  viewMoreEmployees() {
    this.displayAllEmployees = true;
    this.expandSearch.emit(this.searchQuery);
    this.cookieService.set(this.PREVIOUS_PAGE, 'Dashboard');
    this.cookieService.set(this.CURRENT_PAGE, 'Employees');
  }

  searchEmployees() {
    if (this.searchQuery) {
      this.searchResults = this.allEmployees
        .filter(
          (employee) =>
            employee.name &&
            employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            employee.surname &&
            employee.surname.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .filter(employee => employee.name !== undefined)
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.viewValue);
    this.categoryCtrl.setValue(null);
  }

  filterCategories(val: string): string[] {
    return this.categories.filter(category =>
      category.toLowerCase().includes(val.toLowerCase()));
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

  onCategoryRemoved(category: string): void {
    const categories = this.categoryControl.value;
    const index = categories.indexOf(category);
    if (index >= 0) {
      categories.splice(index, 1);
      this.categoryControl.setValue(categories);
    }
  }

  TypeCtrlValueChanges() {
    this.typeControl.valueChanges.subscribe(val => {
      if (val) {
        this.filteredTypes = this.filterTypes(val);
      } else {
        this.filteredTypes = this.types;
      }
    });
  }

  filterTypes(val: string): string[] {
    return this.types.filter(types =>
      types.toLowerCase().includes(val.toLowerCase()));
  }

  onTypeRemoved(type: string): void {
    const types = this.typeControl.value;
    const index = types.indexOf(type);
    if (index >= 0) {
      types.splice(index, 1);
      this.typeControl.setValue(types);
    }
  }

  createChart() {
    if (!this.chartType) {
      this.snackBarService.showSnackbar("Please select a chart type", "snack-error");
      return;
    }
    if (!this.chartName) {
      this.snackBarService.showSnackbar("Please enter a chart name", "snack-error");
      return;
    }
    if (this.selectedCategories.length < 1) {
      this.snackBarService.showSnackbar("Missing chart category", "snack-error");
      return;
    }

    this.chartService.createChart(this.selectedCategories, this.chartName, this.chartType)
      .subscribe({
        next: response => {
          this.snackBarService.showSnackbar("Chart created", "snack-success");
          this.dialog.closeAll();
          this.selectedCategories = [];
          this.chartName = '';
          this.chartType = '';
          this.ngOnInit();
        },
        error: error => {
          this.snackBarService.showSnackbar("Failed to create chart", "snack-error");
        }
      }
      );
    this.selectedCategories = [];
    this.categoryControl.setValue(null);
  }

  onDropDownChange() {
    if (this.selectedDataItems.length < 1) {
      return;
    }
    this.chartService.getChartDataByType(this.selectedDataItems).subscribe({
      next: data => {
        this.chartData = data.data;
        this.chartLabels = data.labels;
      },
      error: error => {
        this.snackBarService.showSnackbar("Failed to get chart data", "snack-error");
      }
    });
  }

  CaptureEventlast(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set(this.CURRENT_PAGE, target.innerText);
  }

  recieveNumber(number: any) {
    this.chartService.getAllCharts().subscribe({
      next: data => this.charts = data,
      error: error => this.toast.error({ detail: "Error", summary: "Failed to get charts.", duration: 5000, position: 'topRight' })
    })
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

  dataSource: MatTableDataSource<{
    Name: string;
    Position: string | undefined;
    Level: number | undefined;
    Client: string;
    Roles: string[];
    Email: string | undefined;
  }> = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;

  getEmployees() {
    this.employeeService
      .getAllProfiles()
      .pipe(
        switchMap((employees: EmployeeProfile[]) => {
          const modifiedEmployees$ = employees.map((employee: EmployeeProfile) => {
            return this.employeeRoleService.getRoles(employee.email!).pipe(
              map((roles) => ({
                Name: `${employee.name} ${employee.surname}`,
                Position: employee.employeeType!.name,
                Level: employee.level,
                Client: employee.clientAllocated ? employee.clientAllocated : 'Bench',
                Roles: this.sortRoles(roles),
                Email: employee.email,
              }))
            );
          });
          return forkJoin(modifiedEmployees$);
        }),
        tap((data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
        }),
        catchError((error) => {
          this.toast.error({
            detail: `Error: ${error}`,
            summary: 'Failed to load employees',
            duration: 10000,
            position: 'topRight',
          });
          return of([]);
        })
      )
      .subscribe();
  }

  sortRoles(roles: string[]): string[] {
    const adminRoles = roles.filter(role => role.toLowerCase().includes('admin')).sort().reverse();
    const nonAdminRoles = roles.filter(role => !role.toLowerCase().includes('admin')).sort();

    return [...adminRoles, ...nonAdminRoles];
  }

  employeeClickEvent(employee: EmployeeProfile): void {
    this.selectedEmployee.emit(employee);
    this.cookieService.set(this.CURRENT_PAGE, 'EmployeeProfile');
    this.cookieService.set(this.PREVIOUS_PAGE, 'Dashboard');
    console.log(employee);
  }

  ViewUser(email: string) {
    this.cookieService.set('selectedUser', email);
  }
}
