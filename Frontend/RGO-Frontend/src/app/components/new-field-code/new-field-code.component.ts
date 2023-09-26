import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
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
    private toast: NgToastService) {
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
        status: ['', Validators.required],
        option: [''],
        internal: [false],
        internalTable: [''],
        options: this.fb.array([]) 
      }),
    });
    this.isUnique = true;
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
        options:optionValue != "" ? [ 
          {
            id: 0,
            fieldCodeId: 0,
            option: optionValue
          }
        ] : []
      };
  
      this.fieldCodeService.saveFieldCode(fieldCodeDto).subscribe({
              next: (data) => {
                this.toast.success({detail:"Field Code saved!", position:'topRight'})
                this.newFieldCodeForm.disable();
              },
              error: (error) => {
                if(error.error === "Field with that name found"){
                  this.isUnique = false;
                }
                else {
                  this.toast.error({detail:"Error", summary:error, duration:5000, position:'topRight'});
                }
              }
            });
    }
  }
}
