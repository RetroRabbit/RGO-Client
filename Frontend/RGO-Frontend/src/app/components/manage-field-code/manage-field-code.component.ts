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

  private initializeForm() {
    this.newFieldCodeForm = this.fb.group({
      name: ['',
        [Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-Z ]*$')]],
      description: [''],
      regex: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      console.log('Submitting the following object:', this.newFieldCodeForm.value);  // This line logs the form's value to the console
      this.fieldCodeService.saveFieldCode(this.newFieldCodeForm.value).subscribe({
        next: (data) => {
          console.log("submitting form values!!")
          console.log(this.newFieldCodeForm.value)
        },
        
        error: (error) => {
          console.log("error with form values")
        }
      })
      // this.submitFieldCode();
    } else {
      this.showValidationErrors();
    }
  }

  // private submitFieldCode() {
  //   this.fieldCodeService.saveFieldCode(this.newFieldCodeForm.value).subscribe({
  //     next: (data) => {
  //       console.log("submitting form values!!")
  //       console.log(this.newFieldCodeForm.value)
  //     },
  //     error: (error) => {
  //     }
  //   })
  // }

  private showValidationErrors() {
    this.newFieldCodeForm.markAllAsTouched();
  }
}
