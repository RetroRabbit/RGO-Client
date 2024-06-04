import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EmployeeRoleService } from 'src/app/services/hris/employee/employee-role.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { ClientService } from 'src/app/services/hris/client.service';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeData } from 'src/app/models/hris/employeedata.interface';
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  NgZone,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  Observable,
  catchError,
  first,
  forkJoin,
  map,
  of,
  pipe,
  skipWhile,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeType } from 'src/app/models/hris/constants/employeeTypes.constants';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { GenericDropDownObject } from 'src/app/models/hris/generic-drop-down-object.interface';
import { EmployeeStatus } from 'src/app/models/hris/constants/employee-status.constants';
import { stat } from 'fs/promises';
@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ViewEmployeeComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() addEmployeeEvent = new EventEmitter<void>();
  @Output() managePermissionsEvent = new EventEmitter<void>();
  _searchQuery: string = '';
  filteredEmployees: EmployeeProfile[] = [];
  getPreviousEmployees: boolean = false;

  @Input()
  set searchQuery(text: string) {
    this._searchQuery = text;
    this.applySearchFilter();
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  get isAdminOrSuperAdmin() {
    return this.authAccessService.isSuperAdmin() || this.authAccessService.isAdmin();
  }

  PREVIOUS_PAGE = 'previousPage';

  roles: Observable<string[]> = this.employeeRoleService.getAllRoles().pipe(
    map((roles: string[]) =>
      roles.filter((role) => !role.includes('SuperAdmin'))
    ),
    first()
  );
  employeeStatus: string[] = EmployeeStatus;
  employeeTerminated: string[] = [];

  peopleChampions: Observable<GenericDropDownObject[]> = this.getPeopleChampionsForFilter();
  usertypes: Observable<GenericDropDownObject[]> = this.getUserTypesForFilter();
  currentChampionFilter: GenericDropDownObject = new GenericDropDownObject;
  currentUserTypeFilter: GenericDropDownObject = new GenericDropDownObject;
  employeestatusFilter: GenericDropDownObject = new GenericDropDownObject;

  defaultPageSize: number = 10
  onAddEmployeeClick(): void {
    this.addEmployeeEvent.emit();
    this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
    this.router.navigateByUrl('/create-employee');
  }

  constructor(
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private clientService: ClientService,
    private cookieService: CookieService,
    private ngZone: NgZone,
    private router: Router,
    private navService: NavService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    private employeeTypeService: EmployeeTypeService
  ) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getTerminatedEmployees();
    this.onResize();
    if (this.cookieService.get(this.PREVIOUS_PAGE) == '/dashboard') {
      this._searchQuery = this.cookieService.get('searchString');
    }

    if (!this.isAdminOrSuperAdmin) {
      this.displayedColumns = ['Name', 'Position', 'Level', 'Client'];
    }
  }

  ngAfterViewInit() {
    this.getEmployees();
    this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
  }

  isLoading: boolean = true;

  getEmployees(): void {
    this.isLoading = true;
    const clients$: Observable<Client[]> = this.clientService
      .getAllClients()
      .pipe(catchError(() => of([] as Client[])));

    this.employeeService
      .getEmployeeProfiles()
      .pipe(
        switchMap((employees: EmployeeProfile[]) =>
          this.combineEmployeesWithRolesAndClients(employees, clients$)
        ),
        catchError((error) => {
          this.snackBarService.showSnackbar(
            'Failed to load employees',
            'snack-error'
          );
          return of([]);
        }),
        first()
      )
      .subscribe((data) => {
        this.setupDataSource(data);
        console.log("here", data)
        this.isLoading = false;
        this.applySearchFilter();
      });
  }

  private combineEmployeesWithRolesAndClients(
    employees: EmployeeProfile[],
    clients$: Observable<Client[]>
  ): Observable<EmployeeData[]> {
    const rolesRequests$ = employees.map((employee) =>
      this.employeeRoleService
        .getRoles(employee.email!)
        .pipe(catchError(() => of([] as string[])))
    );

    return forkJoin([of(employees), clients$, ...rolesRequests$]).pipe(
      map(([employees, clients, ...rolesList]) =>
        this.constructEmployeeData(employees, clients, rolesList)
      )
    );
  }

  private constructEmployeeData(
    employees: EmployeeProfile[],
    clients: Client[],
    rolesList: string[][]
  ): EmployeeData[] {
    const employeeDataList: EmployeeData[] = employees.map(
      (employee, index) => {
        const client = clients.find(
          (client) =>
            employee.clientAllocated && client.id === +employee.clientAllocated
        );
        const sortedRoles = this.sortRoles(rolesList[index]);
        return {
          Name: `${employee.name} ${employee.surname}`,
          Position: employee.employeeType!.name,
          Level: employee.level,
          Client: client ? client.name : 'None',
          Roles: sortedRoles,
          Email: employee.email,
        };
      }
    );
    return employeeDataList;
  }

  private setupDataSource(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);

    console.log("in here", this.dataSource)
    this.ngZone.run(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._changePageSize(this.defaultPageSize);
    });
    this.dataSource._updateChangeSubscription();
  }


  private getDataSource() {
    this.datasSource = new MatTableDataSource(this.filteredEmployees);
    this.ngZone.run(() => {
      this.datasSource.sort = this.sort;
      this.datasSource.paginator = this.paginator;
      this.paginator._changePageSize(this.defaultPageSize);
    });
    this.datasSource._updateChangeSubscription();
  }

  getFormattedDate(date: Date) {
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const formattedDates = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDates;
  }

  getTenureDifference(date1: Date, date2: Date) {
    const millisecondsDiff = date2.getTime() - date1.getTime();
    const secondsDiff = millisecondsDiff / 1000;
    const minutesDiff = secondsDiff / 60;
    const hoursDiff = minutesDiff / 60;
    const daysDiff = Math.floor(hoursDiff / 24);
    return { days: daysDiff, hours: Math.floor(hoursDiff % 24), minutes: Math.floor(minutesDiff % 60), seconds: Math.floor(secondsDiff % 60) };

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

  reset(): void {
    this.dataSource.filter = '';
    this.dataSource._updateChangeSubscription();
  }

  ViewUser(email: string) {
    this.cookieService.set('selectedUser', email);
  }

  employeeClickEvent(employee: {
    Name: string;
    Position: string | undefined;
    Level: number | undefined;
    Client: string;
    Roles: string[];
    Email: string | undefined;
  }): void {
    this.employeeService
      .getEmployeeProfiles()
      .pipe(
        map(
          (employees: EmployeeProfile[]) =>
            employees.filter(
              (emp: EmployeeProfile) =>
                `${emp.name} ${emp.surname}` === `${employee.Name}`
            )[0]
        ),
        tap((data) => {
          this.selectedEmployee.emit(data);
          this._searchQuery = '';
          this.router.navigateByUrl('/profile/' + data.id)
          this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
        }),
        first()
      )
      .subscribe();
  }

  displayedColumns: string[] = ['Name', 'Position', 'Level', 'Client', 'Roles'];
  displayedTerminatedColumns: string[] = ['Name', 'Position', 'Tenure', 'LastDay', 'Reason'];

  dataSource: MatTableDataSource<EmployeeData> = new MatTableDataSource();
  datasSource: MatTableDataSource<EmployeeProfile> = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  screenWidth: number = 992;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  applySearchFilter() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    this.dataSource._updateChangeSubscription();
  }

  pageSizes: number[] = [1, 5, 10, 25, 100];

  get pageIndex(): number {
    return this.paginator?.pageIndex ?? 0;
  }

  get getNumberOfPages(): number {
    if (!this.paginator || this.paginator.pageSize === 0) return 0;
    return Math.ceil(this.paginator.length / this.paginator.pageSize);
  }

  get visiblePages(): number[] {
    const totalPages = this.getNumberOfPages;

    let maxVisiblePages = this.screenWidth <= 992 ? 2 : 4;

    let startPage = Math.max(
      this.paginator.pageIndex - Math.floor(maxVisiblePages / 2),
      0
    );
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
    startPage = Math.max(endPage - maxVisiblePages + 1, 0);

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  changeRole(email: string, role: string): void {
    this.employeeRoleService
      .updateRole(email, role)
      .pipe(
        tap(() => {
          this.snackBarService.showSnackbar(
            'Role changed successfully!',
            'snack-success'
          );
          this.getEmployees();
        }),
        catchError((error) => {
          this.snackBarService.showSnackbar(
            'Falied to change role',
            'snack-error'
          );
          return of(null);
        })
      )
      .subscribe();
  }

  onMenuOpened() {
    const buttonWidth =
      document.querySelector<HTMLElement>('.role-btn')?.offsetWidth;
    const elements = document.getElementsByClassName('mat-mdc-menu-panel');

    for (let i = 0; i < elements.length; i++) {
      (elements[i] as HTMLElement).style.width = `${buttonWidth}px`;
    }
  }

  get pageSize(): number {
    return this.paginator ? this.paginator.pageSize : 1;
  }

  set pageSize(size: number) {
    this.paginator.pageSize = size;
    this.dataSource._updateChangeSubscription();
  }

  get start(): number {
    return this.paginator
      ? this.paginator.pageIndex * this.paginator.pageSize + 1
      : 0;
  }

  get end(): number {
    return this.paginator
      ? (this.paginator.pageIndex + 1) * this.paginator.pageSize
      : 0;
  }

  goToPage(page: number): void {
    this.paginator.pageIndex = page - 1;
    this.dataSource._updateChangeSubscription();
  }

  changePeopleChampionFilter(champion: GenericDropDownObject) {
    this.currentChampionFilter = champion;
    this.filterEmployeeTable();
  }

  changeUserTypeFilter(employeeType: GenericDropDownObject) {
    this.currentUserTypeFilter = employeeType;
    this.filterEmployeeTable();
  }

  filterEmployeeTable() {
    this.isLoading = true;
    const clients$: Observable<Client[]> = this.clientService
      .getAllClients()
      .pipe(catchError(() => of([] as Client[])));

    this.employeeService
      .filterEmployees(this.currentChampionFilter.id || 0, this.currentUserTypeFilter.id || 0)
      .pipe(
        switchMap((employees: EmployeeProfile[]) =>
          this.combineEmployeesWithRolesAndClients(employees, clients$)
        ),
        catchError((error) => {
          this.snackBarService.showSnackbar(
            'Failed to load employees',
            'snack-error'
          );
          return of([]);
        }),
        first()
      )
      .subscribe((data) => {
        this.setupDataSource(data);
        this.isLoading = false;
        this.applySearchFilter();
      });
  }

  getPeopleChampionsForFilter(): Observable<GenericDropDownObject[]> {
    return this.employeeService.filterEmployees(0, EmployeeType.PeopleChampion).pipe(
      map(employees => {
        const champions: GenericDropDownObject[] = employees.map(employee => ({
          id: employee.id || 0,
          name: employee.name || 'Unknown'
        }));
        champions.unshift({ id: 0, name: 'All' });
        return champions;
      })
    );
  }

  getTerminatedEmployees() {
    this.employeeService.getEmployeeProfiles().subscribe({
      next: data => {
        this.filteredEmployees = data.filter((emp: any) => emp.active == false)
        this.getDataSource();
        this.isLoading = false;
        console.log(this.filteredEmployees);
      }
    });
  }


  toggleEmployees(event: any) {
    const selectedEmployeeStatus = event.value;
    if (selectedEmployeeStatus == 'Previous Employees') {
      this.getPreviousEmployees = true;
    }
    else {
      this.getPreviousEmployees = false
    }
  }

  getUserTypesForFilter(): Observable<GenericDropDownObject[]> {
    return this.employeeTypeService.getAllEmployeeTypes().pipe(
      map(types => {
        const userTypes: GenericDropDownObject[] = types.map(type => ({
          id: type.id || 0,
          name: type.name || 'Unknown'
        }));
        userTypes.unshift({ id: 0, name: 'All' });
        return userTypes;
      })
    );
  }

  splitAndCapitalizeCamelCase(input: string): string {
    const words = input.split(/(?=[A-Z])/);
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const result = capitalizedWords.join(' ');
    return result;
  }
}
