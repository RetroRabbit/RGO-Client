import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import { Table } from 'primeng/table';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { BankingAndStarterKitDto } from 'src/app/models/hris/banking-and-starterkit.interface';
import { SystemNav } from 'src/app/services/hris/system-nav.service';

@Component({
  selector: 'app-employee-approvals',
  templateUrl: './employee-approvals.component.html',
  styleUrls: ['./employee-approvals.component.css']
})
export class EmployeeApprovalsComponent {
  PREVIOUS_PAGE = "previousPage";

  searchTerm: string = '';
  filterText: string = '';

  bankingAndStarterKitData: BankingAndStarterKitDto[] = [];
  filteredEmployeeDtos: any[] = [];
  filteredEmployeeIds: number[] = [];

  displayedColumns: string[] = ['name', 'type', 'date', 'status', 'action'];

  userDocumentsMap: string[] = [];
  pageSizes: number[] = [1, 5, 10, 25, 100];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild('dataTable') dataTable: Table | undefined = undefined;
  @ViewChild('searchInput') searchInput!: ElementRef;

  isUnique?: boolean = true;
  isLoading: boolean = true;
  showConfirmDialog: boolean = false;

  pendingCount: number = 0;
  approvedCount: number = 0;
  declinedCount: number = 0;
  screenWidth: number = 992;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dialogTypeData: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: '' };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  constructor(
    private employeeBankingandstarterkitService: EmployeeBankingandstarterkitService,
    private snackBarService: SnackbarService,
    public router: Router,
    public cookieService: CookieService,
    public selectedTabService: SystemNav
  ) { }

  ngOnInit(): void {
    this.fetchData(this.selectedTabService.getSelectedTabIndex());
  }

  fetchData(active: number = this.selectedTabService.getSelectedTabIndex()): void {
    this.isLoading = true;
    this.employeeBankingandstarterkitService.getAllBankingAndStarterkits().subscribe({
      next: (data: BankingAndStarterKitDto[]) => {
        this.bankingAndStarterKitData = data;
        this.updateStatusCounts(data)
        this.buildFilteredArray(1);
        this.selectedTabService.setSelectedTabIndex(active)
      },
      error: () => this.snackBarService.showSnackbar("Error fetching banking and starter kit data", "snack-error"),
      complete: () => this.isLoading = false
    })
  }

  updateStatusCounts(dtos: BankingAndStarterKitDto[]) {
    this.pendingCount = 0;
    this.approvedCount = 0;
    this.declinedCount = 0;

    let bankingDtos: EmployeeBanking[] = [];
    let documentDtos: EmployeeDocument[] = [];

    dtos.forEach(dto => {
      if (dto.employeeBankingDto) {
        bankingDtos.push(dto.employeeBankingDto)
      }
      else {
        documentDtos.push(dto.employeeDocumentDto)
      }
    })

    this.pendingCount = bankingDtos.filter(dto => dto.status == 1).length;
    this.approvedCount = bankingDtos.filter(dto => dto.status == 0).length;
    this.declinedCount = bankingDtos.filter(dto => dto.status == 2).length;

    let employeeIds: number[] = [];
    documentDtos.forEach(dto => {
      if (!employeeIds.includes(dto.employeeId))
        employeeIds.push(dto.employeeId)
    });

    employeeIds.forEach(id => {
      let employeeDocuments = documentDtos.filter(dto => {
        return dto.employeeId == id
      })
      if (employeeDocuments.length < 4)
        this.pendingCount++
      else {
        if (employeeDocuments.every(document => document.status == 0))
          this.approvedCount++
        else if (employeeDocuments.every(document => document.status == 2))
          this.declinedCount++
        else
          this.pendingCount++
      }
    });
  }

  buildFilteredArray(status: number) {
    this.filteredEmployeeDtos = [];
    let indexVisistedArray: number[] = [];
    for (let i = 0; i < this.bankingAndStarterKitData.length; i++) {
      if (!indexVisistedArray.includes(i)) {
        const currentDto = this.bankingAndStarterKitData[i];
        if (currentDto.employeeBankingDto !== null && currentDto.employeeBankingDto.status == status) {
          this.filterDocumentTypeAndStatus(currentDto, true, status);
        }
        if (currentDto.employeeDocumentDto !== null) {
          const employeeDocumentsIndexes = this.findEmployeeDocuments(i, currentDto.employeeDocumentDto.employeeId);
          let documentsForEmployee: EmployeeDocument[] = [];

          employeeDocumentsIndexes.forEach(id => {
            indexVisistedArray.push(id);
            documentsForEmployee.push(this.bankingAndStarterKitData[id].employeeDocumentDto)
          });

          if (documentsForEmployee.length < 4) {
            if(status == 1)
              this.filterDocumentTypeAndStatus(currentDto, false, status);
          }
          else {
            let sameStatuses = documentsForEmployee.every(document => document.status == documentsForEmployee[0].status);
            if (!sameStatuses) {
              if (status == 1)
                this.filterDocumentTypeAndStatus(currentDto, false, status);
            } else {
              if (status == documentsForEmployee[0].status)
                this.filterDocumentTypeAndStatus(currentDto, false, status);
            }
          }
        }
      }
    }
    this.filteredEmployeeDtos.sort((a, b) => (a.name < b.name ? -1 : 1));
    this.dataSource = new MatTableDataSource(this.filteredEmployeeDtos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sortByNameDefault(this.sort);
  }

  findEmployeeDocuments(startIndex: number, employeeId: number): number[] {
    let numberIndex: number[] = [];

    for (let i = startIndex; i < this.bankingAndStarterKitData.length; i++) {
      if (this.bankingAndStarterKitData[i].employeeDocumentDto &&
        this.bankingAndStarterKitData[i].employeeDocumentDto.employeeId == employeeId) {
        numberIndex.push(i);
      }
    }
    return numberIndex;
  }

  filterDocumentTypeAndStatus(documentOrBanking: BankingAndStarterKitDto, isBanking: boolean, status: number) {
    this.filteredEmployeeDtos.push({
      employeeId: documentOrBanking.employeeId,
      name: documentOrBanking.name as string,
      surname: documentOrBanking.surname as string,
      update: isBanking ? 'Banking Details' : 'Starter Kit',
      approval: status,
      date: isBanking ? documentOrBanking.employeeBankingDto.pendingUpdateDate : documentOrBanking.employeeDocumentDto.uploadDate
    });
  }

  filterBankingAndDocumentsByStatus(status: number) {
    if (status < 2)
      this.selectedTabService.setSelectedTabIndex((status == 1) ? 0 : 1);
    else
      this.selectedTabService.setSelectedTabIndex(2);

    this.buildFilteredArray(status);
  }

  routeToApprovalPages(element: any) {
    if (element.update == "Banking Details")
      this.router.navigateByUrl(`/view-banking-approval/${element.employeeId}`)
    else
      this.router.navigateByUrl(`/view-starter-kit-approval/${element.employeeId}`);
  }

  sortByNameDefault(sort: MatSort) {
    const sortState: Sort = { active: 'name', direction: 'asc' };
    if (sort) {
      sort.active = sortState.active;
      sort.direction = sortState.direction;
      sort.sortChange.emit(sortState);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getDateDisplay(date: Date): string {
    if (this.isToday(date)) {
      return 'Today';
    } else {
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return formattedDate;
    }
  }

  // clear(table: Table) {
  //   table.clear();
  // }

  filterData(event: Event): void {
    const filterValue = this.filterText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    const searchInput = event.target as HTMLInputElement;

    if (searchInput.value.trim() !== '') {
      searchInput.classList.add('search-filled');
    } else {
      searchInput.classList.remove('search-filled');
    }
  }

  changePageSize(size: number) {
    this.paginator.pageSize = size;
    this.dataSource._updateChangeSubscription();
  }

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

  getType(id: number) {
    return dataTypes.find(type => type.id == id)?.value;
  }
}