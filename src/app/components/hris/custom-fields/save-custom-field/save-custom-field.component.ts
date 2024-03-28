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

  selectedCustomField!: CustomField;
  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  isUpdateClicked: boolean = false;
  isArchiveClicked: boolean = false;
  fieldCodeCapture: string = "";
  showAdvanced: boolean = false;
  isRequired: boolean = false;
  PREVIOUS_PAGE = "previousPage";
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
    if (this.selectedCustomField) {
      this.initializeForm();
    }
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
    this.navService.showSystemNavbar = true;
  }

  private initializeForm() {
    this.selectedType = this.selectedCustomField?.type;
    const optionsControls = this.selectedCustomField?.options?.map(option => this.fb.control(option.option)) || [];
    this.fieldCodeCapture = this.selectedCustomField.name as string;
    this.newFieldCodeForm = this.fb.group({
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
      required:[this.selectedCustomField?.required, Validators.required],
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
          fieldCodeId: this.selectedCustomField?.id,
          option: optionValue,
        };
      });

      const existingOptions = this.selectedCustomField?.options?.map(option => option.option) || [];
      const optionsToRemove = existingOptions.filter(option => !optionsArray.some((opt: any) => opt.option === option));
      const updatedOptions = optionsArray.filter((option: any) => !optionsToRemove.includes(option.option));
      var formValues = this.newFieldCodeForm.value;
      var customField = new CustomField();
      customField.id = this.selectedCustomField? this.selectedCustomField.id : 0,
      customField.code = formValues['code'],
      customField.name = formValues['name'],
      customField.description = formValues['description'],
      customField.regex =  formValues['regex'],
      customField.type = formValues['type'],
      customField.status = formValues['status'],
      customField.internal = formValues['internal'],
      customField.internalTable = formValues['internalTable'],
      customField.options = formValues['type'] == 4 ?  updatedOptions: [],
      customField.category = formValues['category'],
      customField.required = formValues['required']
      
      this.customFieldService.saveFieldCode(customField).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Custom field has been saved successfully", "snack-success");
          this.selectedCustomField = data;
          this.newFieldCodeForm.disable();
          this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
          this.router.navigateByUrl('/system-settings');
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error.error, "snack-error");
        }
      });
    }
    else{
      this.snackBarService.showSnackbar("Some fields are still missing information", "snack-error");
    }
  }

  returnOptionsArray(){
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
    if (this.selectedCustomField) {
      this.customFieldService.deleteFieldCode(this.selectedCustomField).subscribe({
        next: () => {
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
    this.cookieService.set(this.PREVIOUS_PAGE, '/system-settings');
    this.router.navigateByUrl('/system-settings');
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

  toggleShowAdvance(){
    this.showAdvanced = !this.showAdvanced;
  }

  toggleRequired(){
    this.isRequired = !this.isRequired;
  }
}
