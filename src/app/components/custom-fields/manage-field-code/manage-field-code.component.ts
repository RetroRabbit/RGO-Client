import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { Router } from '@angular/router';
import { FieldCode } from 'src/app/models/field-code.interface';
import { Table } from 'primeng/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';

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
          if(error.error === "Field with that name found"){
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
        this.filteredFieldCodes = this.fieldCodes;
      },
      error: error => {
        this.snackBarService.showSnackbar("Error loading Field Codes", "snack-error");
      }
    });
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

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
