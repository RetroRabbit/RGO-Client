import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  newFieldCodeForm!: FormGroup;

  constructor(
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  // private initializeForm() {
  //   this.newFieldCodeForm = this.fb.group({
  //     name: ['',
  //       [Validators.required,
  //       Validators.minLength(1),
  //       Validators.maxLength(255),
  //       Validators.pattern('^[a-zA-Z ]*$')]],
  //     description: [''],
  //     regex: [''],
  //     type: ['', Validators.required],
  //     status: ['', Validators.required],
  //   });
  // }

  private initializeForm() {
    this.newFieldCodeForm = this.fb.group({
      id: [''],  // for FieldCodeOptions.id
      option: [''], // for FieldCodeOptions.option
      fieldCode: this.fb.group({ // for FieldCodeOptions.fieldCode
        code: [''], // for FieldCode.code
        name: ['', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(255),
            Validators.pattern('^[a-zA-Z ]*$')
        ]], // for FieldCode.name
        description: [''], // for FieldCode.description
        regex: [''], // for FieldCode.regex
        type: ['', Validators.required], // for FieldCode.type
        status: ['', Validators.required] // for FieldCode.status
      })
    });
}

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const formData = this.newFieldCodeForm.value;
      console.log('Submitting the following object:', formData);
      
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
