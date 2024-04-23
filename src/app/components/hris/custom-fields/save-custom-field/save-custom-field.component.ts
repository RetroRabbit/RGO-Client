import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { statuses } from 'src/app/models/hris/constants/statuses.constants';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
@Component({
  selector: 'app-save-custom-field',
  templateUrl: './save-custom-field.component.html',
  styleUrls: ['./save-custom-field.component.css']
})
export class SaveCustomFieldComponent {

  selectedCustomField?: CustomField;
  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  isUpdateClicked: boolean = false;
  isArchiveClicked: boolean = false;
  fieldCodeCapture: string = "";
  showAdvanced: boolean = false;
  isRequired: boolean = false;
  PREVIOUS_PAGE = "previousPage";
  optionsValid: boolean = true;

  customFieldForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', [Validators.required]],
    description: [''],
    regex: [''],
    type: [-1, Validators.required],
    status: [-1, Validators.required],
    internal: [false],
    internalTable: [''],
    options: this.fb.array([]),
    category: [-1, Validators.required],
    required: [false]
  });

  constructor(public router: Router,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    public cookieService: CookieService,
    public navService: NavService,
    private systemService: SystemNav) {
    this.selectedCustomField = systemService.selectedField;
  }

  ngOnInit() {
    this.navService.showNavbar = false;
    this.navService.showSystemNavbar = false;
    this.options.push(this.fb.control(''));
    this.options.push(this.fb.control(''));
    if (this.selectedCustomField) {
      this.populateCustomFieldForm();
    }
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
    this.navService.showSystemNavbar = true;
  }

  get options(): FormArray {
    return this.customFieldForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control(''));
    this.checkSelectedOption(4);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
    this.checkSelectedOption(4);
  }

  onSubmit() {
    if (this.customFieldForm.valid) {
      const optionsArray = this.options.value.map((optionValue: any) => {
        return {
          id: 0,
          fieldCodeId: this.selectedCustomField?.id,
          option: optionValue,
        };
      });

      const existingOptions = this.selectedCustomField?.options?.map(option => option.option) || [];
      const optionsToRemove = existingOptions.filter(option => !optionsArray.some((opt: any) => opt.option === option));
      const updatedOptions = optionsArray.filter((option: any) => !optionsToRemove.includes(option.option));
      var customField = new CustomField();
      customField = this.customFieldForm.value;
      customField.id = this.selectedCustomField ? this.selectedCustomField.id : 0,
        customField.options = this.customFieldForm.value['type'] == 4 ? updatedOptions : [],
        customField.status = 0;
        
        this.customFieldService.saveFieldCode(customField).subscribe({
          next: (data) => {
            this.snackBarService.showSnackbar("Custom field has been saved successfully", "snack-success");
            this.selectedCustomField = data;
            this.customFieldForm.disable();
            this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
            this.systemService.selectedField = undefined;
            this.router.navigateByUrl('/system-settings');
          },
          error: (error) => {
            this.snackBarService.showSnackbar(error.error, "snack-error");
          }
        });
    }
    else {
      this.snackBarService.showSnackbar("Some fields are still missing information", "snack-error");
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const formArray = this.customFieldForm.get('options') as FormArray;
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
  }

  back() {
    this.systemService.selectedField = undefined;
    this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
    this.router.navigateByUrl('/system-settings');
  }

  formatCustomFieldCodeFromName(name: string = "") {
    let code;
    if (name == "") {
      code = this.fieldCodeCapture.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "");
    } else {
      code = name.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "");
    }
    this.customFieldForm.patchValue({ code: code });
  }

  toggleShowAdvance() {
    this.showAdvanced = !this.showAdvanced;
  }

  toggleRequired() {
    this.isRequired = !this.isRequired;
  }

  private populateCustomFieldForm() {
    this.selectedType = this.selectedCustomField?.type;
    const optionsControls = this.selectedCustomField?.options?.map(option => this.fb.control(option.option)) || [];
    this.fieldCodeCapture = this.selectedCustomField?.name as string;
    this.customFieldForm = this.fb.group({
      code: [this.selectedCustomField?.code, Validators.required],
      name: [this.selectedCustomField?.name, Validators.required],
      description: [this.selectedCustomField?.description],
      regex: [this.selectedCustomField?.regex],
      type: [this.selectedType, Validators.required],
      status: [this.selectedCustomField?.status, Validators.required],
      internal: [this.selectedCustomField?.internal],
      internalTable: [this.selectedCustomField?.internalTable],
      options: this.fb.array(optionsControls),
      category: [this.selectedCustomField?.category, Validators.required],
      required: [this.selectedCustomField?.required, Validators.required],
    });
  }

  checkSelectedOption(option: any) {
    if (option == 4 || option.value == 4) {
      this.optionsValid = false;
      if (this.options.length < 2)
        this.optionsValid = false;
      else
        this.optionsValid = true;
    }
    else if (option.value != 4 || option != 4)
      this.optionsValid = true;
  }
}
