import { EmployeeFilterView } from 'src/app/models/hris/employee-filter-view.interface';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EmployeeRoleService } from 'src/app/services/hris/employee/employee-role.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeData } from 'src/app/models/hris/employeedata.interface';
import { Component, Output, EventEmitter, ViewChild, HostListener, NgZone, Input, ViewEncapsulation } from '@angular/core';
import { Observable, catchError, first, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeType } from 'src/app/models/hris/constants/employeeTypes.constants';
import { EmployeeTypeService } from 'src/app/services/hris/employee/employee-type.service';
import { GenericDropDownObject } from 'src/app/models/hris/generic-drop-down-object.interface'
import { EmployeeStatus } from 'src/app/models/hris/constants/employee-status.constants';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/components/shared-components/store/app.state';
import { SharedAccordionFunctionality } from '../employee-profile/shared-accordion-functionality';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ViewEmployeeComponent {

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private employeeProfileService: EmployeeProfileService,
    private employeeRoleService: EmployeeRoleService,
    private cookieService: CookieService,
    private ngZone: NgZone,
    private router: Router,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    private employeeTypeService: EmployeeTypeService
  ) { }

  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() addEmployeeEvent = new EventEmitter<void>();
  @Output() managePermissionsEvent = new EventEmitter<void>();

  @ViewChild('currentTable', { read: MatSort, static: true }) sortcurrentEmployees!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  _searchQuery: string = '';
  filteredEmployees: EmployeeFilterView[] = [];
  employeeStatus: string[] = EmployeeStatus;
  getActiveEmployees: boolean = true;
  isLoading: boolean = true;
  defaultPageSize: number = 10
  selectedChampion?: GenericDropDownObject = { id: 0, name: 'All' } as GenericDropDownObject;
  displayedColumns: string[] = ['Name', 'Position', 'Level', 'Client'];
  displayedTerminatedColumns: string[] = ['terminatedNames', 'terminatedPosition', 'Tenure', 'Last Day', 'Reason'];
  dataSource: MatTableDataSource<EmployeeFilterView> = new MatTableDataSource();
  PREVIOUS_PAGE = 'previousPage';
  roles: string[] = [];
  peopleChampions: Observable<GenericDropDownObject[]> = new Observable;
  usertypes: Observable<GenericDropDownObject[]> = new Observable;
  currentChampionFilter: GenericDropDownObject = new GenericDropDownObject;
  currentUserTypeFilter: GenericDropDownObject = new GenericDropDownObject;

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

  get isJourney() {
    return this.authAccessService.isJourney();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.usertypes = this.getUserTypesForFilter();
    this.peopleChampions = this.getPeopleChampionsForFilter();
    this.employeeRoleService.getAllRoles().subscribe((data: string[]) => {
      this.roles = data.filter((role) => !role.includes('SuperAdmin'));
    });

    this.peopleChampions.subscribe({
      next: data => {
        this.selectedChampion = data.find(x => x.id == 0)
      }
    })
    
    this.onResize();

    if (this.cookieService.get(this.PREVIOUS_PAGE) == '/dashboard') {
      this._searchQuery = this.cookieService.get('searchString');
    }

    if (this.isAdminOrSuperAdmin) {
      this.displayedColumns = ['Name', 'Position', 'Level', 'Client', 'Roles'];
    }

    if(this.isJourney){
      this.peopleChampions.subscribe({
        next: data => {
          this.selectedChampion = data.find(x => x.id == this.authAccessService.getUserId())
        }
      })
    }
    this.peopleChampions.subscribe({
      next: data =>
        this.selectedChampion = this.isJourney
          ? data.find(x => x.id == this.authAccessService.getUserId() ?? 0)
          : data.find(x => x.id == 0)
    })
  }

  ngAfterViewInit() {
    this.filterEmployeeTable();
    this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
  }

  onAddEmployeeClick(): void {
    this.addEmployeeEvent.emit();
    this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
    this.router.navigateByUrl('/create-employee');
  }

  private combineEmployeesWithRolesAndClients(
    employees: EmployeeFilterView[]
  ): Observable<EmployeeData[]> {
    return forkJoin([of(employees)]).pipe(
      map(([employees]) => this.constructEmployeeData(employees))
    );
  }

  private constructEmployeeData(
    employees: EmployeeFilterView[]
  ): EmployeeData[] {
    const employeeDataList: EmployeeData[] = employees.map(
      (employee) => {
        return {
          Name: `${employee.name} ${employee.surname}`,
          Position: employee.position,
          Level: employee.level,
          Client: employee.clientAllocated ?? 'None',
          Roles: [employee.roleDescription],
          Email: employee.email,
          engagementDate: employee.engagementDate,
          terminationDate: employee.terminationDate,
          inactiveReason: employee.inactiveReason
        };
      }
    );
    return employeeDataList;
  }

  private setupDataSource(data: any[]): void {
    this.dataSource = new MatTableDataSource(data);

    this.ngZone.run(() => {
      this.dataSource.sort = this.sortcurrentEmployees;
      this.dataSource.paginator = this.paginator;
      this.paginator._changePageSize(this.defaultPageSize);
    });

    this.dataSource._updateChangeSubscription();
  }

  sortByNameDefault(sort: Sort) {
    if (!this.dataSource || !sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((employeeName1: any, employeeName2: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'terminatedNames': return this.sortTerminatedNames(employeeName1.name, employeeName2.name, isAsc);
        default: return 0;
      }
    });
  }

  getFormattedTerminatedDate(date: any) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`
  }

  getTenureDifference(date1: any, date2: any) {
    const newDate1Obj = new Date(date1);
    const newDate2Obj = new Date(date2);

    let years = newDate2Obj.getFullYear() - newDate1Obj.getFullYear();
    let months = newDate2Obj.getMonth() - newDate1Obj.getMonth();

    months = (months + 12) % 12;
    years -= Math.floor(months / 12);

    return (years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '') + (months > 0 ? "" + ` ${months} ${months === 1 ? 'month' : 'months'}` : '');
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

  employeeClickEvent(employee: any): void {
    this.employeeProfileService.getEmployeeProfileByEmail(employee.Email).
      subscribe((data) => {
        this.selectedEmployee.emit(data);
        this._searchQuery = '';
        this.router.navigateByUrl('/profile/' + data.id)
        this.cookieService.set(this.PREVIOUS_PAGE, '/employees');
      })
  }

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

  changeRole(email: string, newRole: string): void {
    this.employeeRoleService
      .updateRole(email, newRole)
      .pipe(
        tap(() => {
          this.snackBarService.showSnackbar("Updated", "snack-success");
        }),
        catchError((er) => {
          this.snackBarService.showError(er);
          this.filterEmployeeTable();
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

    this.employeeProfileService
      .filterEmployees(this.currentChampionFilter.id || 0, this.currentUserTypeFilter.id || 0, this.getActiveEmployees)
      .pipe(
        switchMap((employees: EmployeeFilterView[]) => this.combineEmployeesWithRolesAndClients(employees)),
        catchError((er) => {
          this.snackBarService.showError(er);
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
    return this.employeeProfileService.filterEmployees(0, EmployeeType.PeopleChampion).pipe(
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

  toggleEmployees(event: any) {
    const selectedEmployeeStatus = event.value;
    if (selectedEmployeeStatus == 'Previous Employees') {
      this.currentChampionFilter = { id: 0, name: 'All' };
      this.getActiveEmployees = false;
      this.filterEmployeeTable()
    }
    else {
      this.getActiveEmployees = true;
      this.filterEmployeeTable()
    }
  }

  getUserTypesForFilter(): Observable<GenericDropDownObject[]> {
    var data = this.sharedAccordionFunctionality.employeeTypes;
    
    const userTypes: GenericDropDownObject[] = data.map(type => ({
      id: type.id || 0,
      name: type.name || 'Unknown'
    }));
    
    userTypes.unshift({ id: 0, name: 'All' });
    return of(userTypes);
  }

  splitAndCapitalizeCamelCase(input: string): string {
    const words = input.split(/(?=[A-Z])/);
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const result = capitalizedWords.join(' ');
    return result;
  }

  sortTerminatedNames(EmployeeName1: string, EmployeeName2: string, isAsc: boolean) {
    return (EmployeeName1 < EmployeeName2 ? -1 : 1) * (isAsc ? 1 : -1);
  }
}