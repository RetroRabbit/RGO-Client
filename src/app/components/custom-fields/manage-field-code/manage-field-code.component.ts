import { Component, HostListener, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})

export class ManageFieldCodeComponent {
  fieldCodes: FieldCode[] = [];
  filteredFieldCodes: FieldCode[] = [];
  selectedFieldCode?: FieldCode;
  isClicked: boolean = false;
  statuses: any[] = [];
  dataTypes: any[] = [];
  newFieldCodeForm!: FormGroup;
  searchTerm: string = '';
  @ViewChild('dataTable') dataTable: Table | undefined = undefined;
  filterText: string = '';
  isUnique?: boolean = true;

  activeTab: number = 0;
  selectedFields: number = 0;
  activeFields: number = 0;
  passiveFields: number = 0;

  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'edit'];

  dataSource: MatTableDataSource<FieldCode> = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  screenWidth: number = 992;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  pageSizes: number[] = [1, 5, 10, 25, 100];

  onRowSelect(fieldCode: FieldCode) {
    this.selectedFieldCode = fieldCode;
    this.isClicked = true;
  }

  constructor(
    public router: Router,
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    public cookieService: CookieService,
    private snackBarService: SnackbarService) {
    this.initializeForm();
  }

  private initializeForm() {
    this.newFieldCodeForm = this.fb.group({
      fieldCode: this.fb.group({
        code: [''],
        name: [''],
        description: [''],
        regex: [''],
        type: [''],
        status: [''],
        option: [''],
        internal: [false],
        internalTable: [''],
        options: this.fb.array([])
      }),
    });
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

  ngOnInit(): void {
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: fieldCodes => {
        this.fieldCodes = fieldCodes;
        this.filteredFieldCodes = this.fieldCodes.filter(field => field.status == 0);
        this.dataSource = new MatTableDataSource(this.filteredFieldCodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getActivePassive();
      },
      error: error => {
        this.snackBarService.showSnackbar("Error loading Field Codes", "snack-error");
      }
    });
  }

  getActivePassive() {
    this.fieldCodes.forEach(field => {
      if (field.status == 0) this.activeFields++;
      else this.passiveFields++;
    })
  }

  onTypeChange() {
    this.isClicked = true;
    this.selectedFieldCode = this.selectedFieldCode;
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
}
