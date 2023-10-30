import { Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/employee-profile.interface';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, first, map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();
  @Output() addEmployeeEvent = new EventEmitter<void>();
  
  onAddEmployeeClick(): void {
    this.addEmployeeEvent.emit();
    this.cookieService.set('currentPage', '+ Add New Hire');
  }
  searchTerm: string = '';
  filteredEmployees$: Observable<EmployeeProfile[]> =
    this.employeeService.getAllProfiles();
  Employees: EmployeeProfile[] = [];
  selectedEmp: any;
  roles: Observable<string[]> = this.employeeRoleService.getAllRoles().pipe(first())

  constructor(
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.onResize();
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService
      .getAllProfiles()
      .pipe(
        map((employees: EmployeeProfile[]) => {
          return employees.map((emp: EmployeeProfile) => {
            const roles: string[]= [];
            this.employeeRoleService.getRoles(emp.email).pipe(first()).subscribe((data) => roles.push(...data));
            return {
              Name: emp.name + ' ' + emp.surname,
              Position: emp.employeeType.name,
              Level: emp.level,
              Client: emp.clientAllocated ? emp.clientAllocated : 'Bench',
              Roles: roles
            }
          })
        }),
        first()
        )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
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

  employeeClickEvent(employee: EmployeeProfile): void {
    this.selectedEmp = employee;
    this.selectedEmployee.emit(this.selectedEmp);
    this.cookieService.set('currentPage', 'Profile');
  }

  displayedColumns: string[] = ['Name', 'Position', 'Level', 'Client', 'Roles'];

  dataSource: MatTableDataSource<{
    Name: string;
    Position: string;
    Level: number;
    Client: string;
    Roles: string[];
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

  changePageSize(size: number) {
    this.paginator.pageSize = size;
    this.dataSource._updateChangeSubscription();
  }

  get pageIndex(): number {
    return this.paginator.pageIndex;
  }

  prevPage() {
    if (!this.paginator.hasPreviousPage()) return;
    this.paginator.previousPage();
  }

  nextPage() {
    if (!this.paginator.hasNextPage()) return;
    this.paginator.nextPage();
  }

  get visiblePages(): number[] {
    const totalPages = this.paginator.getNumberOfPages();
    
    let maxVisiblePages = this.screenWidth <= 992 ? 2 : 4;
    
    let startPage = Math.max(this.paginator.pageIndex - Math.floor(maxVisiblePages / 2), 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
    startPage = Math.max(endPage - maxVisiblePages + 1, 0);
  
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1);
    }
    return pages;
  }  
}
