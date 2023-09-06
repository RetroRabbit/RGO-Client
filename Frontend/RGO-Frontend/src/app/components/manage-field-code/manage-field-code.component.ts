import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { FieldCodeService } from 'src/app/services/field-code.service';

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})
export class ManageFieldCodeComponent {

  public statuses = [
    { id: 0, title: 'Active' },
    { id: 1, title: 'Archive' },
  ];

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
        code: ['', [Validators.required]],
        name: ['', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
        description: [''],
        regex: [''],
        type: ['', Validators.required],
        status: ['', Validators.required]
      }),
      id: [''],
      option: [''],
      internal: [false]
    });
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const { fieldCode, option, internal } = this.newFieldCodeForm.value;
      
      const formData = {
        newFieldCode: [
          {
            id: 0,
            ...fieldCode,
            type: parseInt(fieldCode.type, 10),
            status: parseInt(fieldCode.status, 10),
            internal
          }
        ],
        fieldCodeOptions: [
          {
            id: 0,
            fieldCode: {
              id: 0,
              ...fieldCode,
              type: parseInt(fieldCode.type, 10),
              status: parseInt(fieldCode.status, 10),
              internal
            },
            option
          }
        ]
      };

      console.log("=======FORM DATA===========")
      console.log(formData)
      
      this.fieldCodeService.saveFieldCode(formData).subscribe({
        next: (data) => {
          console.log("Form submitted successfully!", data);
        },
        error: (error) => {
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
