import { Component, HostListener, ViewChild, EventEmitter, Output, TemplateRef, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { Router } from '@angular/router';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})

export class ManageFieldCodeComponent {
  customFields: CustomField[] = [];
  filteredCustomFields: CustomField[] = [];
  selectedCustomFields: CustomField[] = [];
  selectedCustomField!: CustomField;
  newFieldCodeForm!: FormGroup;
  searchTerm: string = '';
  filterText: string = '';

  isUnique?: boolean = true;
  showConfirmDialog: boolean = false;

  activeTab: number = 0;
  selectedFields: number = 0;
  activeFields: number = 0;
  passiveFields: number = 0;
  activeFieldsSearch: number = 0;
  archiveFieldsSearch: number = 0;
  displayedColumns: string[] = ['id', 'name', 'type', 'status', 'edit'];

  dataSource: MatTableDataSource<CustomField> = new MatTableDataSource();
  dialogTypeData: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: '' };
  isLoading: boolean = true;
  runCounter: number = 0;
  runThreshold: number = 2;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  screenWidth: number = 992;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  
  pageSizes: number[] = [1, 5, 10, 25, 100];
  PREVIOUS_PAGE = "previousPage";
  constructor(
    public router: Router,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder,
    public cookieService: CookieService,
    private snackBarService: SnackbarService,
    private systemService: SystemNav,
    private navService: NavService,
    private ngZone: NgZone,
    private authAccessService: AuthAccessService) {
  }

  ngOnInit(): void {
    if (this.authAccessService.isAdmin() ||
      this.authAccessService.isSuperAdmin() ||
      this.authAccessService.isTalent() ||
      this.authAccessService.isJourney()) {
      this.fetchData();
    }
  }

  ngAfterViewInit(): void {
    if (this.authAccessService.isAdmin() ||
      this.authAccessService.isSuperAdmin() ||
      this.authAccessService.isTalent() ||
      this.authAccessService.isJourney()) {
      this.fetchData();
    }
  }

  fetchData(active: number = 0) {
    this.isLoading = true;
    this.customFieldService.getAllFieldCodes().subscribe({
      next: fieldCodes => {
        this.customFields = fieldCodes;
        this.filteredCustomFields = this.customFields.filter(field => field.status == active);
        this.getDataSource();
        this.runCounter++;
        if (this.shouldReset()) {
          this.isLoading = false;
          this.resetRunCounter();
        }
      },
      error: () => {
        this.snackBarService.showSnackbar("Error fetching field codes", "snack-error");
        this.isLoading = false;
      }
    })
    this.isLoading = false;
  }

  getDataSource(){
    this.dataSource = new MatTableDataSource(this.filteredCustomFields);
    this.ngZone.run(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator.pageIndex = 0;
      this.paginator._changePageSize(10);
      this.selectedCustomFields = [];
      this.filterText = "";
      this.getActivePassive();
      this.sortByIdDefault(this.sort);
    });
    this.dataSource._updateChangeSubscription();
  }

  shouldReset(): boolean {
    return this.runCounter >= this.runThreshold;
  }

  resetRunCounter(){
    return this.runCounter = 0;
  }

  get options() {
    return (this.newFieldCodeForm.get('fieldCode.options') as FormArray);
  }

  addOption() {
    this.options.push(this.fb.control(''));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const { fieldCode } = this.newFieldCodeForm.value;

      const optionsArray = this.options.value.map((optionValue: any, index: number) => {
        return {
          id: index,
          fieldCodeId: 0,
          option: optionValue
        };
      });

      let fieldCodeDto = new CustomField();
        fieldCodeDto.id = 0;
        fieldCodeDto.code = fieldCode.code,
        fieldCodeDto.name = fieldCode.name,
        fieldCodeDto.description = fieldCode.description,
        fieldCodeDto.regex = fieldCode.regex,
        fieldCodeDto.type = parseInt(fieldCode.type),
        fieldCodeDto.status =  parseInt(fieldCode.status),
        fieldCodeDto.internal = fieldCode.internal,
        fieldCodeDto.internalTable = fieldCode.internalTable,
        fieldCodeDto.options = optionsArray,
        fieldCodeDto.required = fieldCode.required

      this.customFieldService.saveFieldCode(fieldCodeDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Field code saved", "snack-success");
          this.newFieldCodeForm.disable();
        },
        error: (error) => {
          if (error.error === "Field with that name found") {
            this.isUnique = false;
          }
          else {
            this.snackBarService.showSnackbar(error, "snack-error");
          }
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  private showValidationErrors() {
    this.newFieldCodeForm.markAllAsTouched();
  }

  getActivePassive() {
    this.passiveFields = this.activeFields = 0;
    this.customFields.forEach(field => {
      if (field.status == 0) this.activeFields++;
      else this.passiveFields++;
    })
  }

  onTypeChange() {
    this.selectedCustomFields = this.selectedCustomFields;
  }

  filterData() {
    const filterValue = this.filterText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.filterText === "") {
      this.activeFieldsSearch = 0;
      this.archiveFieldsSearch = 0;
    } else {
      this.activeFieldsSearch = this.archiveFieldsSearch = 0;
      this.dataSource.filteredData.forEach((field: CustomField) => {
        if (field.status === 0) {
          this.activeFieldsSearch++;
        }
        if (field.status === -1) {
          this.archiveFieldsSearch++;
        }
      });
    }
  }

  onSearch(event: Event) {
    if (this.filteredCustomFields) {
      this.filteredCustomFields = this.customFields.filter(fieldCode =>
        fieldCode.name && fieldCode.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addNewField() {
    this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
    this.router.navigateByUrl('/save-custom-field');
  }

  saveCustomField(field: CustomField) {
    this.systemService.selectedField = field;
    this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
    this.router.navigateByUrl('/save-custom-field');
  }

  changeTab(tabIndex: number) {
    if(this.isLoading == true){
      return;
    }
    this.activeTab = tabIndex;
    this.filteredCustomFields = this.customFields.filter(fieldCode => fieldCode.status == this.activeTab);
    this.dataSource = new MatTableDataSource(this.filteredCustomFields);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.selectedCustomFields = [];
    this.filterText = "";
    this.sortByIdDefault(this.sort);  
    this.getDataSource();
  }

  sortByIdDefault(sort: MatSort) {
    const sortState: Sort = { active: 'id', direction: 'asc' };
    if (sort) {
      sort.active = sortState.active;
      sort.direction = sortState.direction;
      sort.sortChange.emit(sortState);
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

  onRowSelect(fieldCode: CustomField, event: any) {
    if (this.selectedCustomFields?.includes(fieldCode)) {
      this.selectedCustomFields.splice(this.selectedCustomFields.indexOf(fieldCode), 1);
    }
    else {
      this.selectedCustomFields?.push(fieldCode);
    }
  }

  moveToActive(field: CustomField) {
    var updatedField = field;
    updatedField.status = 0;
    this.customFieldService.updateFieldCode(updatedField).subscribe({
      next: (data) => {
        this.snackBarService.showSnackbar("Field code updated", "snack-success");
        this.fetchData(this.activeTab);
      }, error: (error) => {
        this.snackBarService.showSnackbar(error, "snack-error");
      }
    });
  }

  getType(id: number) {
    return dataTypes.find(type => type.id == id)?.value;
  }

  hasSelected() {
    return this.selectedCustomFields.length > 0;
  }

  toggleSelectedFields() {
    let unsuccessfulSubmits = 0;

    this.selectedCustomFields.forEach(element => {
      let updatedField = element;
      updatedField.status = updatedField.status == 0 ? -1 : 0;
      this.customFieldService.updateFieldCode(updatedField).subscribe({
        next: () => {
          this.fetchData(this.activeTab);
          this.selectedCustomFields = [];
        },
        error: () => {
          unsuccessfulSubmits++;
        }
      })
    });
    if (unsuccessfulSubmits == 0) {
      this.snackBarService.showSnackbar("Fields moved successfully", "snack-success");
    }
    else {
      this.snackBarService.showSnackbar(`${unsuccessfulSubmits} failed to move`, "snack-error");
    }
  }

  showDialog(status: number) {
    this.dialogTypeData.type = 'save';
    this.dialogTypeData.confirmButtonText = 'Save';
    this.dialogTypeData.denyButtonText = 'Cancel';

    if (status === 0) {
      this.dialogTypeData.title = 'Archive customs fields'
      this.dialogTypeData.subtitle = 'Are you sure you want to archive these custom fields?';
    } else {
      this.dialogTypeData.title = 'Move to active'
      this.dialogTypeData.subtitle = 'Are you sure you want to move these custom fields to active?';
    }
    this.showConfirmDialog = true;
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.toggleSelectedFields();
    }
  }
}
