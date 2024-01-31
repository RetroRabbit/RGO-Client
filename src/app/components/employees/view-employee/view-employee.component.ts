import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.interface';
import { EmployeeData } from 'src/app/models/employeedata.interface';
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  NgZone,
  Input,
} from '@angular/core';
import {
  Observable,
  catchError,
  first,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HideNavService } from 'src/app/services/hide-nav.service';
import { AuthAccessService } from 'src/app/services/auth-access.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() addEmployeeEvent = new EventEmitter<void>();
  @Output() managePermissionsEvent = new EventEmitter<void>();
  _searchQuery: string = '';

  @Input()
  set searchQuery(text: string) {
    this._searchQuery = text;
    this.applySearchFilter();
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  PREVIOUS_PAGE = 'previousPage';

  roles: Observable<string[]> = this.employeeRoleService.getAllRoles().pipe(
    map((roles: string[]) =>
      roles.filter((role) => !role.includes('SuperAdmin'))
    ),
    first()
  );

  peopleChampions: Observable<{ id: number; name: string }[]>;
  currentChampionName: string = 'All';

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
    private hideNavService: HideNavService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService
  ) {
    hideNavService.showNavbar = true;
    this.peopleChampions = new Observable((observer) => {
      const userId = +this.authAccessService.getUserId();
      const items = [
        { id: 0, name: 'All' },
        { id: userId, name: 'Mine' },
      ];
      observer.next(items);
      observer.complete();
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.onResize();
    if (this.cookieService.get(this.PREVIOUS_PAGE) == '/dashboard') {
      this._searchQuery = this.cookieService.get('searchString');
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
      .getAllProfiles()
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
          Client: client ? client.name : 'Bench',
          Roles: sortedRoles,
          Email: employee.email,
        };
      }
    );
    return employeeDataList;
  }

  private setupDataSource(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.ngZone.run(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.dataSource._updateChangeSubscription();
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
      .getAllProfiles()
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
          console.log(data.id);
          this.router.navigateByUrl('/profile/' + data.id);
          this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
        }),
        first()
      )
      .subscribe();
  }

  displayedColumns: string[] = ['Name', 'Position', 'Level', 'Client', 'Roles'];

  dataSource: MatTableDataSource<EmployeeData> = new MatTableDataSource();

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

  changePeopleChampionFilter(champion: { id: number; name: string }) {
    this.currentChampionName = champion.name;

    this.isLoading = true;
    const clients$: Observable<Client[]> = this.clientService
      .getAllClients()
      .pipe(catchError(() => of([] as Client[])));

    this.employeeService
      .getEmployeeProfilesByPeopleChampion(champion.id)
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
}
