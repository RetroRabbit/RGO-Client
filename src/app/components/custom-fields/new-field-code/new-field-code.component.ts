import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-new-field-code',
  templateUrl: './new-field-code.component.html',
  styleUrls: ['./new-field-code.component.css']
})
export class NewFieldCodeComponent {

  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  newFieldCodeForm!: FormGroup;
  fieldCodes?: FieldCode[];
  isUnique?: boolean = true;

  constructor(
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    private toast: NgToastService,
    public cookieService: CookieService,
    private snackBarService: SnackbarService) {

    this.initializeForm();
  }

  ngOnInit(): void {
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: fieldCodes => {
        this.fieldCodes = fieldCodes;
      },
      error: error => {
      }
    });
  }

  private initializeForm() {
    this.newFieldCodeForm = this.fb.group({
      fieldCode: this.fb.group({
        code: ['', Validators.required],
        name: ['', [Validators.required]],
        description: [''],
        regex: [''],
        type: ['', Validators.required],
        status: ['0', Validators.required],
        option: [''],
        internal: [false],
        internalTable: [''],
        options: this.fb.array([])
      }),
    });
    this.isUnique = true;
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
      const optionValue = fieldCode.option;
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
        options:optionsArray
      };


      this.fieldCodeService.saveFieldCode(fieldCodeDto).subscribe({
              next: (data) => {
                this.snackBarService.showSnackbar("Field Code saved!", "snack-success");
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
    }
  }

  back(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', 'Manage Field');
  }
}
