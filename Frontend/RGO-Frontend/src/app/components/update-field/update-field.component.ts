import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
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

  newFieldCodeForm!: FormGroup;


  constructor(public router: Router, private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    private toast: NgToastService) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      console.log('Selected Field Code in FieldCodeUpdateFormComponent:', state['selectedFieldCode']);
      this.selectedFieldCode = state['selectedFieldCode'];
    }
    console.log(this.selectedFieldCode
    )
    this.initializeForm();
  }

  private initializeForm() {
    console.log(this.selectedFieldCode?.code)
    this.newFieldCodeForm = this.fb.group({
      fieldCode: this.fb.group({
        code: [this.selectedFieldCode?.code],
        name: [this.selectedFieldCode?.name],
        description: [this.selectedFieldCode?.description],
        regex: [this.selectedFieldCode?.regex],
        type: [this.selectedFieldCode?.type],
        status: [this.selectedFieldCode?.status],
        option: [this.selectedFieldCode?.options ? this.selectedFieldCode.options.map(option => option.option) : []],
        internal: [false],
        internalTable: [''],
        options: this.fb.array([])
      }),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      const { fieldCode } = this.newFieldCodeForm.value;

      const optionValue = fieldCode.option;

      const fieldCodeDto = {
        id: this.selectedFieldCode?.id,
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
            fieldCodeId: this.selectedFieldCode?.id,
            option: optionValue
          }
        ]
          
      }
      this.fieldCodeService.updateFieldCode(fieldCodeDto).subscribe({
        next: (data) => {
          console.log("Form submitted successfully!", data);
          this.toast.success({detail:"Field Details updated!", position:'topRight'})
        },
        error: (error) => {
          console.error("Error occurred while submitting form!", error);
          this.toast.error({detail:"Error", summary: error, duration:5000, position:'topRight'});
        }
      });

    }
  }
}
