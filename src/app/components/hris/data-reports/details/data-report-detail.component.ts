import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { NavItem } from 'src/app/models/hris/report-menu-item.interface';
import { DataReportingService } from 'src/app/services/hris/data-reporting.service';
import { ReportColumnRequest } from 'src/app/models/hris/report-column-request.interface';
import { MatDialog } from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccessList } from 'src/app/models/hris/data-report-access.interface';
import { ReportAccessRequest } from 'src/app/models/hris/data-report-access-request.interface';
import { MenuItemComponent } from '../report-menu/menu-item.component';
import { employeeColumn } from 'src/app/models/hris/constants/employeeColumn.constants';
import { DataFilterTable } from 'src/app/models/hris/constants/data-filter-table.constants';
import { condition } from 'src/app/models/hris/constants/condition.constants';
import { DataReportFilter } from 'src/app/models/hris/data-report-filter.interface';

@Component({
  selector: 'app-data-report-detail',
  templateUrl: './data-report-detail.component.html',
  styleUrls: ['./data-report-detail.component.css']
})

export class DataReportDetailComponent {
  [x: string]: any;
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';
  dataReportCode: string;
  reportName?: string;
  reportCode?: string;
  selectedEmployeeId?: number;
  selectedRoleId?: number;
  dataReportForm!: FormGroup;
  accessRequest!: ReportAccessRequest;
  dataObjects: DataReport = {};
  accessEmployeeList: AccessList[] = [];
  accessRoleList: AccessList[] = [];
  filteredEmployees: any = [];
  navItems: NavItem[] = [];
  employeeData!: [{ id: number; name: string; }];
  employeeRoles!: [{ id: number; name: string; }];
  isLoading: boolean = false;
  modalAddingNew: boolean = false;
  nonEditable: boolean = true;
  selectedViewOnly?: boolean;
  isReorderable: boolean = true;
  filterList: DataReportColumns[] = [];
  filterRequest!: DataReportFilter;
  SelectedEmployeeColumn?: string;
  SelectedTableName?: string;
  reportFilterValue?: string;
  SelectedCondition?: string;
  valueText?: string;
  

  public employeeColumns = employeeColumn;
  public conditions = condition;
  public dataFilterTables = DataFilterTable;
   

  constructor(private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private dataReportingService: DataReportingService,
    private dialog: MatDialog,
    private fb: FormBuilder) {
    this.dataReportCode = this.route.snapshot.params["code"]
    this.dataReportingService.fetchMenuItems().subscribe({
      next: data => {
        this.navItems = data;
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
  @ViewChild('filterTemplate', { static: true }) filterTemplate!: TemplateRef<any>;
  @ViewChild('dt') dt!: Table;
  @ViewChild(MenuItemComponent) menuItemComponent!: MenuItemComponent;

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.isLoading = true;
    this.onResize();
    this.dataReportCode = this.route.snapshot.params["id"];
    this.populateReportData(this.dataReportCode);
  }

  populateReportData(dataReportCode: string) {
    this.dataReportingService.fetchReportData(dataReportCode).subscribe({
      next: data => {
        this.dataObjects.reportId = data.reportId;
        this.dataObjects.reportName = data.reportName;
        this.dataObjects.columns = data.columns;
        this.dataObjects.data = data.data;
        this.dataObjects.viewOnly = data.viewOnly;
        this.reportName = data.reportName;
        this.reportCode = data.reportCode
        this.accessEmployeeList = data.accessList?.filter(access => access.roleId == null || access.roleId == undefined)!;
        this.accessRoleList = data.accessList?.filter(access => access.roleId != null || access.roleId != undefined)!;
        this.isLoading = false;
        this.filterList = data.columns?.filter(filter => filter.id != null || filter.id != undefined)!;

        if (data.viewOnly) {
          this.nonEditable = true;
        }
        else {
          this.nonEditable = false;
        }

        this.populateMenu()
        this.getAccessAvailability();
        this.initializeForm()
      },
    })
  }

  populateMenu() {
    this.dataReportingService.fetchMenuItems().subscribe({
      next: data => {
        this.navItems = data;
      },
    })
  }

  onViewEmployee(employeeId: number): void {
    this.router.navigateByUrl('/profile/' + employeeId);
    this.cookieService.set(this.PREVIOUS_PAGE, '/data-reports/' + this.dataReportCode);
  }

  UpdateCustomInput(index: number, column: DataReportColumns, e: any) {
    var reportId = this.dataObjects.reportId
    var columnId = column.id;
    var employeeId = this.dataObjects.data![index].Id;
    var checkBoxChecked = e.srcElement.checked;
    var input = e.srcElement.value;

    if (checkBoxChecked == true) {
      input = "true";
    }
    if (checkBoxChecked == false) {
      input = "false"
    }

    this.dataObjects.data![index][column.prop] = input;

    var reportInput = {
      reportId: reportId,
      columnId: columnId,
      employeeId: employeeId,
      input: input
    }

    this.dataReportingService.updateReportData(reportInput).subscribe({
      next: data => {
        this.populateReportData(this.dataObjects.reportCode!);
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }

  moveColumn(event: any, dataReport: DataReport) {
    var requestData: ReportColumnRequest = {
      id: event.columns[event.dropIndex].id,
      reportId: dataReport.reportId!,
      menuId: 0,
      sequence: event.dropIndex,
      name: ''
    }

    this.dataReportingService.moveColumnOnReport(requestData).subscribe({
      next: data => {
        this.populateReportData(this.dataObjects.reportCode!);
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }

  showEditReportModal() {
    this.dialog.open(this.dialogTemplate, {
      width: '500px',
    });
  }

  showEditReportFilter() {
    this.dialog.open(this.filterTemplate, {
      width: '500px',
    });
  }

  editReportName(reportId: number) {
    var input = {
      reportId: reportId,
      name: this.reportName,
      code: this.reportCode
    }

    this.dataReportingService.addOrUpdateReport(input).subscribe({
      next: data => {
        this.populateReportData(this.dataObjects.reportCode!);
        this.snackBarService.showSnackbar("Report Added", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Creation Failed", "snack-error")
      }
    })
  }

  getAccessAvailability() {
    this.dataReportingService.getReportAccess(this.dataObjects.reportId!).subscribe({
      next: data => {
        this.employeeRoles = data.role
        this.employeeData = data.employee
      }
    })
  }

  initializeForm() {
    this.dataReportForm = this.fb.group({
      accessType: new FormControl<string>('', [Validators.required]),
      employeeAccess: new FormControl<string>('', [Validators.required]),
      roleAccess: new FormControl<string>('', [Validators.required]),
      viewOnly: new FormControl<boolean>(false, [Validators.required])
    })
  }

  filterEmployees(event: any) {
    if (event) {
      this.filteredEmployees = this.employeeData.filter(employee => employee.name?.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.filteredEmployees = this.employeeData;
    }
  }

  getEmployeeId(data: any) {
    this.selectedEmployeeId = data.id;
  }

  getRoleId(data: any) {
    this.selectedRoleId = data.id
  }

  getViewOnlyStatus(data: any) {
    this.selectedViewOnly = data;
  }

  modalBack() {
    this.modalAddingNew = false;
  }
  getTable(table: any){
    this.SelectedTableName = table;
 }

  getemployeeColumn(col: any){
      this.SelectedEmployeeColumn = col.value;
  }
  getCondition(condition: any){
    this.SelectedCondition = condition.value;
 }

 
  updateAccess() {
    this.accessRequest = {
      reportId: this.dataObjects.reportId!, access: [{
        employeeId: this.selectedEmployeeId!,
        roleId: this.selectedRoleId,
        viewOnly: this.selectedViewOnly!
      }]
    }

    this.dataReportingService.updateReportAccess(this.accessRequest).subscribe({
      next: data => {
        this.selectedEmployeeId = undefined;
        this.selectedRoleId = undefined;
        this.selectedViewOnly = undefined;
        this.populateReportData(this.dataReportCode)
        this.modalAddingNew = false;
        this.snackBarService.showSnackbar("Access Added", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Access Adding failed", "snack-error")
      }
    })
  }

  AddFilter() {
    this.filterRequest = {
      reportId: this.dataObjects.reportId!,
      employeeId: this.selectedEmployeeId!,
      value: this.valueText!,
      tableName: this.SelectedTableName!,
      condition: this.SelectedCondition!,
      ReportFilterId: 0,
      columnName: this.SelectedEmployeeColumn!
      }
      
    this.dataReportingService.addOrUpdateReportFilter(this.filterRequest).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Filter successfully Added", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Failed to add filter" , "snack-error")
      }
    })
  }

  archiveAccess(accessId: number) {
    this.dataReportingService.archiveReportAccess(accessId).subscribe({
      next: data => {
        this.populateReportData(this.reportCode!);
        this.snackBarService.showSnackbar("Access Archived", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Access Archiving failed", "snack-error")
      }
    })
  }

  archiveFilter(id: number) {
    this.dataReportingService.deleteDataReportFilter(id).subscribe({
      next: data => {
        this.populateReportData(this.reportCode!);
        this.snackBarService.showSnackbar("Filter deleted", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Failed to delete filter", "snack-error")
      }
    })
  }
  archiveColumn(id: number) {
    this.dataReportingService.archiveColumnOnReport(id).subscribe({
      next: data => {
        this.populateReportData(this.reportCode!);
        this.snackBarService.showSnackbar("Column Archived", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Column Archiving failed", "snack-error")
      }
    })
  }

  goBack() {
    this.modalAddingNew = false;
    this.dataReportForm.reset();
  }

  
}