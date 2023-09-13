import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})
export class ManageFieldCodeComponent {

  public statuses = statuses;
  public dataTypes = dataTypes;

  newFieldCodeForm!: FormGroup;

  constructor(
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder
  ) {
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

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const { fieldCode } = this.newFieldCodeForm.value;
  
      const optionValue = fieldCode.option;
  
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
        options: [
          {
            id: 0,
            fieldCodeId: 0,
            option: optionValue
          }
        ]
      };
  
      this.fieldCodeService.saveFieldCode(fieldCodeDto).subscribe({
        next: (data) => {
          console.log("Form submitted successfully!", data);
        },
        error: (error) => {
          console.log(fieldCodeDto);
          console.error("Error occurred while submitting form!", error);
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  private showValidationErrors() {
    this.newFieldCodeForm.markAllAsTouched();
  }
}
