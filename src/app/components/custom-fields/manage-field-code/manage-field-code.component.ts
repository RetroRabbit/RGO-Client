import { Component, HostListener, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { Router } from '@angular/router';
import { FieldCode } from 'src/app/models/field-code.interface';
import { Table } from 'primeng/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { Dialog } from 'src/app/models/confirm-modal.interface';
@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})

export class ManageFieldCodeComponent {
  fieldCodes: FieldCode[] = [];
  filteredFieldCodes: FieldCode[] = [];
  selectedFieldCodes: FieldCode[] = [];
  selectedFieldCode!: FieldCode;
  // statuses: any[] = [];
  newFieldCodeForm!: FormGroup;
  searchTerm: string = '';

  @ViewChild('dataTable') dataTable: Table | undefined = undefined;
  filterText: string = '';
  isUnique?: boolean = true;

  activeTab: number = 0;
  selectedFields: number = 0;
  activeFields: number = 0;
  passiveFields: number = 0;

  displayedColumns: string[] = ['id', 'name', 'type', 'status', 'edit'];
  showConfirmDialog: boolean = false;

  dataSource: MatTableDataSource<FieldCode> = new MatTableDataSource();
  dialogTypeData: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: ''};
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  screenWidth: number = 992;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  pageSizes: number[] = [1, 5, 10, 25, 100];

  @Output() fieldCodeEmitter = new EventEmitter<FieldCode>();

  constructor(
    public router: Router,
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    public cookieService: CookieService,
    private snackBarService: SnackbarService) {
  }
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(active : number =0){
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: fieldCodes =>{
        this.fieldCodes = fieldCodes;
        this.filteredFieldCodes = this.fieldCodes.filter(field => field.status == active);
        this.dataSource = new MatTableDataSource(this.filteredFieldCodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getActivePassive();
        this.activeTab = active;
      },
      error: error => {
        this.snackBarService.showSnackbar("Error fetching field codes", "snack-error");
      },
    })
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

      const fieldCodeDto = {
        id: 0,
        code: fieldCode.code,
        name: fieldCode.name,
        description: fieldCode.description,
        regex: fieldCode.regex,
        type: parseInt(fieldCode.type),
        status: parseInt(fieldCode.status),
        internal: fieldCode.internal,
        internalTable: fieldCode.internalTable,
        options: optionsArray
      };

      this.fieldCodeService.saveFieldCode(fieldCodeDto).subscribe({
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
    this.fieldCodes.forEach(field => {
      if (field.status == 0) this.activeFields++;
      else this.passiveFields++;
    })
  }

  onTypeChange() {
    // this.isClicked = true;
    this.selectedFieldCodes = this.selectedFieldCodes;
  }

  clear(table: Table) {
    table.clear();
  }

  filterData() {
    this.filteredFieldCodes = this.fieldCodes.filter(fieldCode =>
      fieldCode.name && fieldCode.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      fieldCode.code && fieldCode.code.toLowerCase().includes(this.filterText.toLowerCase()) ||
      fieldCode.id && fieldCode.id.toString().toLowerCase().includes(this.filterText.toLowerCase()) ||
      fieldCode.status && (fieldCode.status === 0 ? 'Active' : 'Archived').toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (this.dataTable) {
      this.dataTable.filterGlobal(searchTerm, 'contains');
    }

    if (this.filteredFieldCodes) {
      this.filteredFieldCodes = this.fieldCodes.filter(fieldCode =>
        fieldCode.name && fieldCode.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  AddNewField() {
    this.cookieService.set('currentPage', 'Add new field code');
  }

  changeTab(tabIndex: number) {
    this.activeTab = tabIndex;
    this.filteredFieldCodes = this.fieldCodes.filter(fieldCode => fieldCode.status == this.activeTab);
    this.dataSource = new MatTableDataSource(this.filteredFieldCodes);
    this.selectedFieldCodes = [];
  }

  changePageSize(size: number) {
    if (this.paginator) this.paginator.pageSize = size;
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
    this.paginator.pageSize = size; this.dataSource._updateChangeSubscription();
  }

  get start(): number {
    return this.paginator ? this.paginator.pageIndex * this.paginator.pageSize + 1 : 0;
  }

  get end(): number {
    return this.paginator ? (this.paginator.pageIndex + 1) * this.paginator.pageSize : 0;
  }

  goToPage(page: number): void {
    this.paginator.pageIndex = page - 1;
    this.dataSource._updateChangeSubscription();
  }

  onRowSelect(fieldCode: FieldCode) {
    if(this.selectedFieldCodes?.includes(fieldCode)){
      this.selectedFieldCodes.splice(this.selectedFieldCodes.indexOf(fieldCode), 1);
    }
    else{
      this.selectedFieldCodes?.push(fieldCode);
    }
  }

  moveToActive(field : FieldCode){
    var updatedField = {...field};
    updatedField.status = 0;
    this.fieldCodeService.updateFieldCode(updatedField).subscribe({
      next: (data) =>{
        this.snackBarService.showSnackbar("Field code updated", "snack-success");
        this.fetchData(this.activeTab);
      },error: (error) =>{
        this.snackBarService.showSnackbar(error, "snack-error");
      }
    });
  }

  getType(id: number){
    return dataTypes.find(type => type.id == id)?.value;
  }

  hasSelected(){
    return this.selectedFieldCodes.length > 0;
  }

  toggleSelectedFields(){
    let unsuccessfulSubmits = 0;

    this.selectedFieldCodes.forEach(element => {
      let updatedField = {...element}
      updatedField.status = updatedField.status == 0 ? -1 : 0;
      this.fieldCodeService.updateFieldCode(updatedField).subscribe({
        next: () => {
          this.fetchData(this.activeTab);
        },
        error: () => {
          unsuccessfulSubmits++;
        }
      })
    });
    if(unsuccessfulSubmits == 0){
      this.snackBarService.showSnackbar("Fields moved successfully", "snack-success");
    }
    else{
      this.snackBarService.showSnackbar(`${unsuccessfulSubmits} failed to move`, "snack-error");
    }
  }

  showDialog(status : number){
    this.dialogTypeData.type = 'save';
    this.dialogTypeData.confirmButtonText = 'Save';
    this.dialogTypeData.denyButtonText = 'Cancel';
    
    if(status === 0){
      this.dialogTypeData.title =  'Archive customs fields'
      this.dialogTypeData.subtitle = 'Are you sure you want to archive these custom fields?';
    }else{
      this.dialogTypeData.title =  'Move to active'
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

  EditField(field: FieldCode) {
    // this.cookieService.set('currentPage', 'Add new field code');
    this.fieldCodeEmitter.emit(field);
  }
}
