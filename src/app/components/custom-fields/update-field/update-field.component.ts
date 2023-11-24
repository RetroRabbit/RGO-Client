import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-update-field',
  templateUrl: './update-field.component.html',
  styleUrls: ['./update-field.component.css']
})
export class UpdateFieldComponent {

  @Input() selectedFieldCode?: FieldCode;
  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  isUpdateClicked: boolean = false;
  isArchiveClicked: boolean = false;
  newFieldCodeForm!: FormGroup;

  constructor(public router: Router, private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private snackBarService: SnackbarService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.newFieldCodeForm.disable();
  }

  private initializeForm() {
    this.selectedType = this.selectedFieldCode?.type;
    this.newFieldCodeForm = this.fb.group({
      fieldCode: this.fb.group({
        code: [this.selectedFieldCode?.code, Validators.required],
        name: [this.selectedFieldCode?.name, Validators.required],
        description: [this.selectedFieldCode?.description],
        regex: [this.selectedFieldCode?.regex],
        type: [this.selectedType],
        status: [this.selectedFieldCode?.status],
        option: [this.selectedFieldCode?.options ? this.selectedFieldCode.options.map(option => option.option) : []],
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

  onClick() {
    this.isUpdateClicked = true;
    this.newFieldCodeForm.enable();
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const { fieldCode } = this.newFieldCodeForm.value;

      const optionsArray = this.options.value.map((optionValue: any) => {
        return {
          id: 0,
          fieldCodeId: this.selectedFieldCode?.id,
          option: optionValue,
        };
      });

      const existingOptions = this.selectedFieldCode?.options?.map(option => option.option) || [];
      const optionsToRemove = existingOptions.filter(option => !optionsArray.some((opt: any) => opt.option === option));
      const updatedOptions = optionsArray.filter((option: any) => !optionsToRemove.includes(option.option));

      const fieldCodeDto = {
        id: this.selectedFieldCode?.id,
        code: fieldCode.code,
        name: fieldCode.name,
        description: fieldCode.description,
        regex: fieldCode.regex,
        type: parseInt(this.selectedType),
        status: parseInt(fieldCode.status),
        internal: fieldCode.internal,
        internalTable: fieldCode.internalTable || '',
        options: updatedOptions.map((opt: any) => opt)
      }

      this.fieldCodeService.updateFieldCode(fieldCodeDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Field Details updated!", "snack-success");
          this.selectedFieldCode = data;
          this.newFieldCodeForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    }
  }

  onCancel() {
    this.isUpdateClicked = false;
    this.newFieldCodeForm.reset();
    this.initializeForm();
    this.newFieldCodeForm.disable();
  }

  archiveFieldCode() {
    if (this.selectedFieldCode) {
      this.fieldCodeService.deleteFieldCode(this.selectedFieldCode).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Field Code acrhived!", "snack-success");
          this.newFieldCodeForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    }
  }

  confirmArchive(event: Event) {
    const confirmation = window.confirm('Are you sure you want to archive this field code?');
    if (confirmation) {
      this.archiveFieldCode();
    } else {
      event.preventDefault();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedFieldCode']) {
      this.newFieldCodeForm.reset();
      this.initializeForm();

      const optionsArray = this.newFieldCodeForm.get('fieldCode.options') as FormArray;

      if (this.selectedFieldCode?.options) {
        this.selectedFieldCode.options.forEach(option => {
          optionsArray.push(this.fb.control(option.option));
        });
      }
    }
  }
}
