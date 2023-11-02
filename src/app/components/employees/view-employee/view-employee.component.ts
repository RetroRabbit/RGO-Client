import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import {
  Observable,
  catchError,
  combineLatest,
  first,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { NgToastService } from 'ng-angular-popup';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() addEmployeeEvent = new EventEmitter<void>();
  @Output() managePermissionsEvent = new EventEmitter<void>();

  roles: Observable<string[]> = this.employeeRoleService
    .getAllRoles()
    .pipe(first());

  onAddEmployeeClick(): void {
    this.addEmployeeEvent.emit();
    this.cookieService.set('currentPage', '+ Add New Hire');
  }

  onManagePermissionClick(): void {
    this.managePermissionsEvent.emit();
    this.cookieService.set('currentPage', 'Manage Permissions');
  }

  constructor(
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private clientService: ClientService,
    private toast: NgToastService,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onResize()
  }

  ngAfterViewInit() {
    this.getEmployees();
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    
  }

  getEmployees() {
    this.employeeService
      .getAllProfiles()
      .pipe(
        switchMap((employees: EmployeeProfile[]) => {
          const modifiedEmployees$ = employees.map(
            (employee: EmployeeProfile) => {
              const clients$ = this.clientService.getAllClients().pipe(
                map((clients) =>
                  clients.find(
                    (client) => employee.clientAllocated && client.id === +employee.clientAllocated
                  )
                ),
                map((client) => (client ? client.name : 'Bench')),
                first()
              );

              const roles$ = this.employeeRoleService
                .getRoles(employee.email!)
                .pipe(
                  map((roles) => ({
                    Name: `${employee.name} ${employee.surname}`,
                    Position: employee.employeeType!.name,
                    Level: employee.level,
                    Client: '',
                    Roles: this.sortRoles(roles),
                    Email: employee.email,
                  }))
                );
              
              return combineLatest([clients$, roles$])
                .pipe(
                  map(([clientName, employeeWithRoles]) => {
                    employeeWithRoles.Client = clientName;
                    return employeeWithRoles;
                  })
                );
            }
          );
          return forkJoin(modifiedEmployees$);
        }),
        tap((data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource._updateChangeSubscription();
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

  CaptureEvent(event: any) {
    const target = event.target as HTMLButtonElement;
    this.cookieService.set('currentPage', target.innerText);
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
          this.cookieService.set('currentPage', 'Profile');
        }),
        first()
      )
      .subscribe();
  }

  displayedColumns: string[] = ['Name', 'Position', 'Level', 'Client', 'Roles'];

  dataSource: MatTableDataSource<{
    Name: string;
    Position: string | undefined;
    Level: number | undefined;
    Client: string;
    Roles: string[];
    Email: string | undefined;
  }> = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  screenWidth: number = 992;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSizes: number[] = [1, 5, 10, 25, 100];

  // changePageSize(size: number) {
  //   this.paginator.pageSize = size;
  //   this.dataSource._updateChangeSubscription();
  // }
  changePageSize(size: number) {
    if (this.paginator) this.paginator.pageSize = size;
    this.dataSource._updateChangeSubscription();
  }


  get pageIndex(): number {
    return this.paginator?.pageIndex ?? 0;
  }

  previousPage() {
    if (!this.paginator.hasPreviousPage()) return;
    this.paginator.previousPage();
  }

  nextPage() {
    if (!this.paginator.hasNextPage()) return;
    this.paginator.nextPage();
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
    this.employeeRoleService.addRole(email, role).pipe(
      tap(() => {
        this.toast.success({
          detail: `Role changed successfully!`,
          summary: 'Success',
          duration: 5000,
          position: 'topRight',
        });
        this.getEmployees();
      }),
      catchError((error) => {
        this.toast.error({
          detail: 'Failed to change role',
          summary: 'Error',
          duration: 10000,
          position: 'topRight',
        });
        return of(null);
      })
    ).subscribe();
  }

  get pageSize(): number {
    return this.paginator ? this.paginator.pageSize : 1;
  }

  set pageSize(size: number) {
    if (this.paginator) this.paginator.pageSize = size;
  }

  get start(): number {
    return this.paginator ? this.paginator.pageIndex * this.paginator.pageSize + 1 : 0;
  }

  get end(): number {
    return this.paginator ? (this.paginator.pageIndex + 1) * this.paginator.pageSize : 0;
  }
}
