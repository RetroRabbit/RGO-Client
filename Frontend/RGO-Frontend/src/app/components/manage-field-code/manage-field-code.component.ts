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
      status: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      this.submitFieldCode();
    } else {
      this.showValidationErrors();
    }
  }

  private submitFieldCode() {
    this.fieldCodeService.saveFieldCode(this.newFieldCodeForm.value).subscribe(
      (data: any) => this.handleSuccess(data),
      (error: any) => this.handleError(error)
    );
  }

  private handleSuccess(data: any) {
    console.log('Field code added successfully:', data);
  }

  private handleError(error: any) {
    console.error('An error occurred while adding the field code:', error.message || error);
  }

  private showValidationErrors() {
    this.newFieldCodeForm.markAllAsTouched();
  }
}
