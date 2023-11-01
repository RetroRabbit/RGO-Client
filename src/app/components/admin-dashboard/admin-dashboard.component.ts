import { Component, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
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

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  @Output() selectedEmployee = new EventEmitter<EmployeeProfile>();

  charts: Chart[] = [];
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

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private toast: NgToastService,
    private chartService: ChartService,
    private cookieService: CookieService,
    private router: Router
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
      .getAllEmployees(this.searchQuery)
      .subscribe((data) => {
        this.allEmployees = data;
      });

    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  viewMoreEmployees() {
    this.displayAllEmployees = true;
  }

  searchEmployees() {
    if (this.searchQuery) {
      this.searchResults = this.allEmployees.filter(
        (employee) =>
          employee.name && employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          employee.surname && employee.surname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.activateSearchBar();
    } else {
      this.searchResults = [];
      this.deactivateSearchBar();
    }
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
          //this.dataSource.paginator = this.paginator;
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

  // employeeClickEvent(employee: {
  //   Name: string;
  //   Position: string | undefined;
  //   Level: number | undefined;
  //   Client: string;
  //   Roles: string[];
  //   Email: string | undefined;
  // }): void {
  //   this.employeeService
  //     .getAllProfiles()
  //     .pipe(
  //       map(
  //         (employees: EmployeeProfile[]) =>
  //           employees.filter(
  //             (emp: EmployeeProfile) =>
  //               `${emp.name} ${emp.surname}` === `${employee.Name}`
  //           )[0]
  //       ),
  //       tap((data) => {
  //         this.selectedEmployee.emit(data);
  //         this.cookieService.set('currentPage', 'Profile');
  //       }),
  //       first()
  //     )
  //     .subscribe();
  // }

  // employeeClickEvent(employee: EmployeeProfile): void {
  //   if (employee.id) {
  //     this.employeeProfileService.getEmployeeById(employee.id).subscribe((data) => {
  //       if (data) {
  //         this.selectedEmployee.emit(data);
  //         this.cookieService.set('currentPage', 'Profile');
  //       } else {
  //         // Employee is not found
  //       }
  //     });
  //   } else {
  //     //ID is undefined
  //   }
  // }

  employeeClickEvent(employee: EmployeeProfile): void {
    this.selectedEmployee.emit(employee);
    this.cookieService.set('currentPage', 'Profile');
    console.log(employee);
  }

  ViewUser(email: string) {
    this.cookieService.set('selectedUser', email);
  }
}