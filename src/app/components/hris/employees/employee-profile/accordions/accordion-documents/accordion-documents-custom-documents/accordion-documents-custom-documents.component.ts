import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';

@Component({
  selector: 'app-accordion-documents-custom-documents',
  templateUrl: './accordion-documents-custom-documents.component.html',
  styleUrls: ['./accordion-documents-custom-documents.component.css']
})
export class AccordionDocumentsCustomDocumentsComponent {

  customFields: CustomField[] = [];

  constructor(
    private customFieldService: CustomFieldService,
    private fb: FormBuilder,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) { }

  ngOnInit() {
    this.getDocumentFields();
  }


  getDocumentFields() {
    this.getDocumentFieldCodes();
    this.initializeForm();
  }

  getDocumentsFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[3].id);
        this.checkCustomDocumentsInformation();
      }
    })
  }

  checkCustomDocumentsInformation() {
    const formGroupConfig: any = {};
    this.customFields.forEach(fieldName => {
      if (fieldName.code != null || fieldName.code != undefined) {
        const customData = this.sharedAccordionFunctionality.employeeData.filter((data: EmployeeData) => data.fieldCodeId === fieldName.id)
        formGroupConfig[fieldName.code] = new FormControl({ value: customData[0] ? customData[0].value : '', disabled: true });
        this.sharedAccordionFunctionality.additionalInfoForm = this.fb.group(formGroupConfig);
        if (fieldName.required == true) {
          this.sharedAccordionFunctionality.additionalInfoForm.controls[fieldName.code].setValidators(Validators.required);
        }
        this.sharedAccordionFunctionality.additionalInfoForm.disable();
      }
    });
  }

  getDocumentFieldCodes() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFields = data.filter((data: CustomField) => data.category === this.sharedAccordionFunctionality.category[3].id);
        this.checkCustomDocumentsInformation();
      }
    })
  }
}
