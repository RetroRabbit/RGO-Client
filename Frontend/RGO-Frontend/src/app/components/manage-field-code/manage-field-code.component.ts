import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { FieldCodeState } from 'src/app/store/reducers/field-code.reducer';

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})
export class ManageFieldCodeComponent {

  constructor(private store: Store<{ user: FieldCodeState }>, private fieldCodeService: FieldCodeService){}

  public statuses: any[] = [{ id: 1, title: "Active" }];

  newFieldCodeForm = new FormGroup({
    fieldCodeName: new FormControl('', Validators.required),
    fieldCodeDescription: new FormControl('', Validators.required),
    fieldCodeRegEx: new FormControl('', Validators.required),
    fieldCodeType: new FormControl('', Validators.required),
    fieldCodeStatus: new FormControl('', Validators.required),
  });

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