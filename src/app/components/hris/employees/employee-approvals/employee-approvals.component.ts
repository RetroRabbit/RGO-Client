import { Component, HostListener, ViewChild, ElementRef, ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeBankingandstarterkitService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';
import { BankingAndStarterKitDto } from 'src/app/models/hris/banking-and-starterkit.interface';
import { EmployeeDocumentsStatus } from 'src/app/models/hris/constants/enums/employeeDocumentsStatus';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
import { DialogTypeData } from 'src/app/models/hris/dialog-type-data.model';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-employee-approvals',
  templateUrl: './employee-approvals.component.html',
  styleUrls: ['./employee-approvals.component.css'],
})
export class EmployeeApprovalsComponent {
  PREVIOUS_PAGE = 'previousPage';

  searchTerm: string = '';
  filterText: string = '';

  bankingAndStarterKitData: BankingAndStarterKitDto[] = [];
  filteredEmployeeDtos: any[] = [];
  filteredEmployeeIds: number[] = [];
  displayedColumns: string[] = ['name', 'type', 'date', 'status', 'action'];
  userDocumentsMap: string[] = [];
  pageSizes: number[] = [1, 5, 10, 25, 100];
  isUnique?: boolean = true;
  showConfirmDialog: boolean = false;
  pendingCount: number = 0;
  approvedCount: number = 0;
  declinedCount: number = 0;
  screenWidth: number = 992;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dialogTypeData!: Dialog;
  MIN_STARTERKIT_DOCUMENTS_UPLOADED = 3
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public employeeBankingandstarterkitService: EmployeeBankingandstarterkitService,
    public router: Router,
    public selectedTabService: SystemNav,
    private cdr: ChangeDetectorRef
  ) {
    this.dialogTypeData = new DialogTypeData().dialogTypeData;
  }

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  subscribeToData(): void {
    this.employeeBankingandstarterkitService.getAllBankingAndStarterkits();
    this.employeeBankingandstarterkitService.bankingAndStarterKitData$
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: BankingAndStarterKitDto[]) => {
      this.bankingAndStarterKitData = data;
      this.buildFilteredArray();
      this.cdr.detectChanges();
    });
  }

  buildFilteredArray() {
    this.filteredEmployeeDtos = [];
    let indexVisitedArray: number[] = [];
    const selectedTabIndex = this.selectedTabService.getSelectedTabIndex();
    const selectedStatus = selectedTabIndex === 0 ? EmployeeDocumentsStatus.PENDING : 
                           selectedTabIndex === 1 ? EmployeeDocumentsStatus.APPROVED : 
                                                    EmployeeDocumentsStatus.DECLINED ;

    for (let i = 0; i < this.bankingAndStarterKitData.length; i++) {
      if (!indexVisitedArray.includes(i)) {
        const currentDto = this.bankingAndStarterKitData[i];

   
        if (currentDto.employeeBankingDto && currentDto.employeeBankingDto.status === selectedStatus) {
          this.filterDocumentTypeAndStatus(currentDto, true, selectedStatus);
        }

     
        if (currentDto.employeeDocumentDto) {
          const employeeDocumentsIndexes = this.findEmployeeDocuments(i, currentDto.employeeDocumentDto.employeeId);
          let documentsForEmployee: EmployeeDocument[] = [];

          employeeDocumentsIndexes.forEach(id => {
            indexVisitedArray.push(id);
            documentsForEmployee.push(this.bankingAndStarterKitData[id].employeeDocumentDto);
          });
          if (documentsForEmployee.length < this.MIN_STARTERKIT_DOCUMENTS_UPLOADED) {
            if (selectedStatus === EmployeeDocumentsStatus.PENDING ) {
              this.filterDocumentTypeAndStatus(currentDto, false, selectedStatus);
            }
          } else {
       
            let sameStatuses = documentsForEmployee.every(document => document.status === documentsForEmployee[0].status);
            if (!sameStatuses) {
              if (selectedStatus === EmployeeDocumentsStatus.PENDING) {
                this.filterDocumentTypeAndStatus(currentDto, false, selectedStatus);
              }
            } else {
              if (selectedStatus === documentsForEmployee[0].status ||
                 documentsForEmployee[0].status === EmployeeDocumentsStatus.ACTIONREQUIRED) {
                this.filterDocumentTypeAndStatus(currentDto, false, selectedStatus);
              }
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
      date: isBanking
        ? documentOrBanking.employeeBankingDto.lastUpdateDate
        : documentOrBanking.employeeDocumentDto.lastUpdatedDate,
    });
  }

  filterBankingAndDocumentsByStatus(status: number) {
    this.selectedTabService.setSelectedTabIndex(status);
    this.buildFilteredArray();
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
    return dataTypes.find((type) => type.id == id)?.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}