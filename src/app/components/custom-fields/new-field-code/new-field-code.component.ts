import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { statuses } from 'src/app/models/constants/statuses.constants';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { FieldCode } from 'src/app/models/field-code.interface';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { category } from '../../../models/constants/fieldcodeCategory.constants';
import { HideNavService } from 'src/app/services/hide-nav.service';
import { levels } from '../../../models/constants/levels.constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'rxjs';

@Component({
  selector: 'app-new-field-code',
  templateUrl: './new-field-code.component.html',
  styleUrls: ['./new-field-code.component.css']
})
export class NewFieldCodeComponent {

  public statuses = statuses;
  public dataTypes = dataTypes;
  selectedType: any;
  newFieldCodeForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', [Validators.required]],
    description: [''],
    regex: [''],
    type: [-1, Validators.required],
    status: [-1, Validators.required],
    option: [''],
    internal: [false],
    internalTable: [''],
    options: this.fb.array([]),
    category: [-1, Validators.required]
  });
  fieldCodes?: FieldCode[];
  isUnique?: boolean = true;
  newFieldCodeDto !: FieldCode;
  fieldCodeCapture: string = "";

  constructor(
    private fieldCodeService: FieldCodeService,
    private fb: FormBuilder,
    public cookieService: CookieService,
    private snackBarService: SnackbarService,
    public hideNavService: HideNavService) {

    // this.initializeForm();
  }

  ngOnInit(): void {
    this.hideNavService.showNavbar = false;
    this.hideNavService.showSystemNavbar = false;
    this.fieldCodeService.getAllFieldCodes().subscribe({
      next: fieldCodes => {
        this.fieldCodes = fieldCodes;
      },
      error: error => {
      }
    });
  }

  ngOnDestroy() {
    this.hideNavService.showNavbar = true;
    this.hideNavService.showSystemNavbar = true;
  }
  // private initializeForm() {
  //   this.newFieldCodeForm = this.fb.group({
  //     fieldCode: this.fb.group({
  //       code: ['', Validators.required],
  //       name: ['', [Validators.required]],
  //       description: [''],
  //       regex: [''],
  //       type: [-1, Validators.required],
  //       status: [-1, Validators.required],
  //       option: [''],
  //       internal: [false],
  //       internalTable: [''],
  //       options: this.fb.array([]),
  //       category: [-1, Validators.required]
  //     }),
  //   });
  //   this.isUnique = true;
  // }

  // get options() {
  //   return (this.newFieldCodeForm.get('fieldCode.options') as FormArray);
  // }
  get options() {
    return this.newFieldCodeForm.get('options') as FormArray;
  }

  addOption() {
    const optionsArray = this.newFieldCodeForm.get('options') as FormArray;
    optionsArray.push(this.fb.control(''));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  onSubmit() {
    if (this.newFieldCodeForm.valid) {
      this.formatFieldCode(this.newFieldCodeForm.get('code')?.value);
      // const { fieldCode } = this.newFieldCodeForm.value;
      // const optionValue = fieldCode.option;
      // const optionsArray = this.options.value.map((optionValue: any, index: number) => {
      //   return {
      //     id: index,
      //     fieldCodeId: 0,
      //     option: optionValue
      //   };
      // });
      // this.newFieldCodeDto = {
      //   id: 0,
      //   code: fieldCode.code,
      //   name: fieldCode.name,
      //   description: fieldCode.description,
      //   regex: fieldCode.regex,
      //   type: parseInt(fieldCode.type),
      //   status: parseInt(fieldCode.status),
      //   internal: fieldCode.internal,
      //   internalTable: fieldCode.internalTable,
      //   options: optionsArray,
      //   category: fieldCode.category
      // };

      //console.log(this.newFieldCodeDto);

      // this.fieldCodeService.saveFieldCode(this.newFieldCodeDto).subscribe({
      //   next: (data) => {
      //     this.snackBarService.showSnackbar("Custom field saved", "snack-success");
      //     this.newFieldCodeForm.disable();
      //   },
      //   error: (error) => {
      //     if (error.error === "Field with that name found") {
      //       this.isUnique = false;
      //     }
      //     else {
      //       this.snackBarService.showSnackbar(error, "snack-error");
      //     }
      //   }
      // });
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
      console.log(fieldCodeDto);
      this.fieldCodeService.saveFieldCode(fieldCodeDto).subscribe({
        next: (data) => {
          this.snackBarService.showSnackbar("Custom field saved", "snack-success");
          this.newFieldCodeForm.disable();
        },
        error: (error) => {
          if (error.error === "Field with that name found") {
            this.isUnique = false;
          }
          else {
            this.snackBarService.showSnackbar(error, "snack-error");
          }
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

  back(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', 'Manage Field');
  }

  drop(event: CdkDragDrop<string[]>) {
    const formArray = this.newFieldCodeForm.get('options') as FormArray;
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
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
}
