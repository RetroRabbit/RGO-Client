import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { FieldCodeState } from 'src/app/store/reducers/field-code.reducer';
import { Store } from '@ngrx/store';

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
    private store: Store<{ user: FieldCodeState }>,
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.newFieldCodeForm = this.fb.group({
      fieldCodeName: ['', 
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-Z ]*$')])],
      fieldCodeDescription: [''],
      fieldCodeRegEx: [''],
      fieldCodeType: ['', Validators.required],
      fieldCodeStatus: [null, Validators.required],
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
    this.fieldCodeService.addFieldCode(this.newFieldCodeForm.value).subscribe(
      (data) => {
        this.handleSuccess(data);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  private handleSuccess(data: any) {
    console.log('Field code added successfully:', data);
  }

  private handleError(error: any) {
    console.error('An error occurred while adding the field code:', error);
  }

  private showValidationErrors() {
    this.newFieldCodeForm.markAllAsTouched();
  }
}
