import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { CookieService } from 'ngx-cookie-service';
import { HideNavService } from 'src/app/services/hide-nav.service';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-update-field',
  templateUrl: './update-field.component.html',
  styleUrls: ['./update-field.component.css']
})
export class UpdateFieldComponent {

  @Input() selectedFieldCode!: FieldCode;
  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  isUpdateClicked: boolean = false;
  isArchiveClicked: boolean = false;
  fieldCodeCapture: string = "";
  showAdvanced: boolean = false;
  newFieldCodeForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', [Validators.required]],
    description: [''],
    regex: [''],
    type: [-1, Validators.required],
    status: [-1, Validators.required],
    internal: [false],
    internalTable: [''],
    options: this.fb.array([]),
    category: [-1, Validators.required]
  });
  constructor(public router: Router,
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder, 
    private snackBarService: SnackbarService, 
    public cookieService: CookieService,
    public hideNavService: HideNavService) {
  }

  ngOnInit() {
    this.hideNavService.showNavbar = false;
    this.hideNavService.showSystemNavbar = false;
    if (this.selectedFieldCode) {
      this.initializeForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedFieldCode'] && changes['selectedFieldCode'].currentValue) {
      this.initializeForm();
    }
  }

  ngOnDestroy() {
    this.hideNavService.showNavbar = true;
    this.hideNavService.showSystemNavbar = true;
  }
  
  private initializeForm() {
    this.selectedType = this.selectedFieldCode?.type;
    const optionsControls = this.selectedFieldCode?.options?.map(option => this.fb.control(option.option)) || [];
    this.fieldCodeCapture = this.selectedFieldCode.name as string;
    this.newFieldCodeForm = this.fb.group({
      code: [this.selectedFieldCode?.code, Validators.required],
      name: [this.selectedFieldCode?.name, Validators.required],
      description: [this.selectedFieldCode?.description],
      regex: [this.selectedFieldCode?.regex],
      type: [this.selectedType, Validators.required],
      status: [this.selectedFieldCode?.status, Validators.required],
      internal: [this.selectedFieldCode?.internal],
      internalTable: [this.selectedFieldCode?.internalTable],
      options: this.fb.array(optionsControls),
      category: [this.selectedFieldCode?.category, Validators.required]
    });
  }
  

  get options(): FormArray {
    return this.newFieldCodeForm.get('options') as FormArray;
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
      var formValues = this.newFieldCodeForm.value;
      const fieldCodeDto : FieldCode = {
        id: 0,
        code: formValues['code'],
        name: formValues['name'],
        description: formValues['description'],
        regex: formValues['regex'],
        type: formValues['type'],
        status: formValues['status'],
        internal: formValues['internal'],
        internalTable: formValues['internalTable'],
        options: formValues['type'] == 4 ?  this.returnOptionsArray(formValues['options']): [],
        category: formValues['category'],
      }

      this.fieldCodeService.updateFieldCode(fieldCodeDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Field details updated", "snack-success");
          this.selectedFieldCode = data;
          this.newFieldCodeForm.disable();
          this.cookieService.set('currentPage', 'Custom Field management');
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      });
    }
  }


  returnOptionsArray(array : any[]){
    return this.options.value.map((optionValue: any, index: number) => {
      return {
        id: index,
        fieldCodeId: 0,
        option: optionValue
      };
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    const formArray = this.newFieldCodeForm.get('options') as FormArray;
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
  }

  archiveFieldCode() {
    if (this.selectedFieldCode) {
      this.fieldCodeService.deleteFieldCode(this.selectedFieldCode).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Custom field archived", "snack-success");
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

  back() {
    this.cookieService.set('currentPage', 'Custom Field management');
  }

  captureName() {
    this.formatFieldCode();
  }

  inputCodeChange() {
    this.formatFieldCode(this.newFieldCodeForm.value('code'));
  }

  formatFieldCode(name: string = "") {
    let code;
    if (name == "") {
      code = this.fieldCodeCapture.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "");
    } else {
      code = name.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "");
    }
    this.newFieldCodeForm.patchValue({ code: code });
  }

  toggleshowAdvance(){
    this.showAdvanced = !this.showAdvanced;
  }
}
