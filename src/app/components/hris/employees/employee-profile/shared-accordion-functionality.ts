import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Client } from 'src/app/models/hris/client.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { EmployeeType } from 'src/app/models/hris/employee-type.model';
import { levels } from 'src/app/models/hris/constants/levels.constants';
import { races } from 'src/app/models/hris/constants/races.constants';
import { genders } from 'src/app/models/hris/constants/genders.constants';
import { disabilities } from 'src/app/models/hris/constants/disabilities.constant';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { category } from 'src/app/models/hris/constants/fieldcodeCategory.constants';
import { dataTypes } from 'src/app/models/hris/constants/types.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { AdminDocuments } from 'src/app/models/hris/constants/admin-documents.component';
import { EmployeeDocumentsTypes } from 'src/app/models/hris/constants/employee-documents.constants';
import { StarterKitDocumentTypes } from 'src/app/models/hris/constants/documents.contants';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { EmployeeDocumentService } from 'src/app/services/hris/employee/employee-document.service';
import { MyDocumentTypes } from 'src/app/models/hris/constants/documents.contants';
import { CustomFieldService } from 'src/app/services/hris/field-code.service';
import { nqfLevels } from 'src/app/models/hris/constants/nqfLevels.constant.';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';

@Injectable({
  providedIn: 'root'
})

export class SharedAccordionFunctionality {
  @Output() updateProfile = new EventEmitter<any>();
  @Output() updateDocument = new EventEmitter<number>();
  @Input() employeeProfile!: EmployeeProfile;

  employees: EmployeeProfile[] = [];
  clients: Client[] = [];
  employeeTypes: EmployeeType[] = [];
  filteredClients: Client[] = [];
  filteredEmployees: any = [];
  filteredPeopleChamps: any = [];
  employeeData: EmployeeData[] = [];
  customFields: CustomField[] = [];
  customFieldsDocuments: CustomField[] = [];

  employeeDocuments: EmployeeDocument[] = [];
  adminstrativeDocuments: EmployeeDocument[] = [];
  myDocuments: EmployeeDocument[] = [];
  starterkitDocuments: EmployeeDocument[] = [];
  additionalDocuments: EmployeeDocument[] = [];

  foundClient: EmployeeProfile | undefined;
  foundTeamLead: any;
  foundChampion: EmployeeProfile | undefined;
  employeeProfileDto?: any;
  clientId: number | undefined;
  peopleChampionId: number | undefined;

  fileAdminCategories = AdminDocuments;
  fileEmployeeCategories = EmployeeDocumentsTypes;
  fileStarterKitCategories = StarterKitDocumentTypes;
  fileMyDocumentCategories = MyDocumentTypes;
  employeeQualificationDto: EmployeeQualifications = {
    id: 0,
    employeeId: 0,
    highestQualification: 0,
    school: "",
    fieldOfStudy: "",
    year: "",
    nqfLevel: nqfLevels,
    proofOfQualification: "",
    documentName: "",
  };

  panelOpenState: boolean = false;
  physicalEqualPostal: boolean = true;
  hasDisability: boolean | undefined = false;
  editEmployee: boolean = false;
  editPersonal: boolean = false;
  editAddress: boolean = false;
  editAdditional: boolean = false;
  editContact: boolean = false;
  editQualifications: boolean = false;
  employeeType?: EmployeeType;
  employeeClient!: EmployeeProfile;
  employeeTeamLead!: EmployeeProfile;
  employeePeopleChampion!: EmployeeProfile;
  selectedEmployee!: EmployeeProfile;
  employeePhysicalAddress !: EmployeeAddress;
  employeePostalAddress !: EmployeeAddress;

  profileFormProgress: number = 0;
  documentFormProgress: number = 0;

  myDocumentsProgress: number = 0;
  additionalDocumentsProgress: number = 0;
  addDocProgress: number = 0;
  adminDocumentsProgress: number = 0;
  employeeDocumentsProgress: number = 0;
  documentStarterKitFormProgress: number = 0;

  employeeFormProgress: number = 0;
  personalFormProgress: number = 0;
  contactFormProgress: number = 0;
  addressFormProgress: number = 0;
  additionalFormProgress: number = 0;
  additionalCareerFormProgress: number = 0;
  genders = genders;
  races = races;
  levels = levels;
  nqfLevels = nqfLevels;
  disabilities = disabilities;
  category = category;
  fieldTypes = dataTypes;
  usingProfile: boolean = true;

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  initialsPattern = /^[A-Z]+$/;
  namePattern = /^[a-zA-Z\s'-]*$/

  constructor(
    private fb: FormBuilder,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private employeeDocumentService: EmployeeDocumentService,
    private customFieldService: CustomFieldService,
  ) { }

  personalDetailsForm: FormGroup = this.fb.group({
    gender: { value: '', disabled: true },
    race: { value: '', disabled: true },
    disability: { value: '', disabled: true },
    disabilityNotes: { value: '', disabled: true },
    disabilityList: { value: '', disabled: true }
  });

  employeeContactForm: FormGroup = this.fb.group({
    email: { value: '', disabled: true },
    personalEmail: { value: '', disabled: true },
    cellphoneNo: { value: '', disabled: true },
    houseNo: { value: '', disabled: true },
    emergencyContactName: { value: '', disabled: true },
    emergencyContactNo: { value: '', disabled: true }
  });

  employeeDetailsForm: FormGroup = this.fb.group({
    name: { value: '', disabled: true },
    surname: { value: '', disabled: true },
    initials: { value: '', disabled: true },
    clientAllocated: { value: '', disabled: true },
    employeeType: { value: '', disabled: true },
    level: { value: '', disabled: true },
    teamLead: { value: '', disabled: true },
    dateOfBirth: { value: '', disabled: true },
    idNumber: { value: '', disabled: true },
    engagementDate: { value: '', disabled: true },
    peopleChampion: { value: '', disabled: true }
  });

  addressDetailsForm: FormGroup = this.fb.group({
    physicalUnitNumber: { value: '', disabled: true },
    physicalComplexName: { value: '', disabled: true },
    physicalStreetNumber: { value: '', disabled: true },
    physicalSuburb: { value: '', disabled: true },
    physicalCity: { value: '', disabled: true },
    physicalCountry: { value: '', disabled: true },
    physicalProvince: { value: '', disabled: true },
    physicalPostalCode: { value: '', disabled: true },
    postalUnitNumber: { value: '', disabled: true },
    postalComplexName: { value: '', disabled: true },
    postalStreetNumber: { value: '', disabled: true },
    postalSuburb: { value: '', disabled: true },
    postalCity: { value: '', disabled: true },
    postalCountry: { value: '', disabled: true },
    postalProvince: { value: '', disabled: true },
    postalPostalCode: { value: '', disabled: true }
  });

  employeeQualificationForm: FormGroup = this.fb.group({
    highestQualification: { value: '', disabled: true },
    school: { value: '', disabled: true },
    degree: { value: '', disabled: true },
    fieldOfStudy: { value: '', disabled: true },
    year: { value: '', disabled: true },
    proofOfQualification: { value: '', disabled: true }
  });

  additionalInfoForm: FormGroup = this.fb.group({});
  additionalDocumentForm: FormGroup = this.fb.group({});

  additionalCareerInfoForm: FormGroup = this.fb.group({});

  checkPersonalFormProgress() {
    let filledCount = 0;
    let totalFields = 0;
    const formControls = this.personalDetailsForm.controls;

    if (this.hasDisability) {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length);
    }
    else {
      totalFields = (Object.keys(this.personalDetailsForm.controls).length) - 2;
    }
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '' && this.hasDisability != false && control.value != "na") {
          filledCount++;
        }
        else if (controlName.includes("disability") && this.hasDisability == false) {
          filledCount++;
        }
      }
    }
    this.personalFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkEmployeeFormProgress() {
    let filledCount = 0;
    const formControls = this.employeeDetailsForm.controls;
    const totalFields = Object.keys(this.employeeDetailsForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.employeeFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkContactFormProgress() {
    let filledCount = 0;
    const formControls = this.employeeContactForm.controls;
    const totalFields = Object.keys(this.employeeContactForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.contactFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkAddressFormProgress() {
    let filledCount = 0;
    const formControls = this.addressDetailsForm.controls;
    let totalFields = 0;
    if (this.physicalEqualPostal) {
      totalFields = (Object.keys(this.addressDetailsForm.controls).length) / 2;
    }
    else if (!this.physicalEqualPostal) {
      totalFields = (Object.keys(this.addressDetailsForm.controls).length);
    }

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (this.physicalEqualPostal && controlName.includes("physical") && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
        else if (!this.physicalEqualPostal && control.value != null && control.value != " " && control.value != "") {
          filledCount++;
        }
      }
    }
    this.addressFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkAdditionalFormProgress() {
    let filledCount = 0;
    const formControls = this.additionalInfoForm.controls;
    let totalFields = Object.keys(this.additionalInfoForm.controls).length;

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.additionalFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  checkCareerAdditionalFormProgress() {

    let filledCount = 0;
    const formControls = this.additionalCareerInfoForm.controls;
    let totalFields = Object.keys(this.additionalCareerInfoForm.controls).length;

    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.additionalCareerFormProgress = Math.round((filledCount / totalFields) * 100);
  }

  calculateEmployeeDocumentProgress() {
    const total = this.fileEmployeeCategories.length;
    const fetchedDocuments = this.employeeDocuments.length;
    this.employeeDocumentsProgress = fetchedDocuments / total * 100;
  }

  calculateAdminDocumentProgress() {
    const total = this.fileAdminCategories.length;
    const fetchedDocuments = this.adminstrativeDocuments.length;
    this.adminDocumentsProgress = fetchedDocuments / total * 100;
  }

  calculateStarterKitDocuments() {
    const total = this.fileStarterKitCategories.length;
    const fetchedDocuments = this.starterkitDocuments.length;
    this.documentStarterKitFormProgress = fetchedDocuments / total * 100;
  }

  calculateAdditionalDocumentProgress() {
    this.customFieldService.getAllFieldCodes().subscribe({
      next: data => {
        this.customFieldsDocuments = data.filter((data: CustomField) => data.category === this.category[3].id);
        const total = this.customFieldsDocuments.length;
        const fetchedDocuments = this.additionalDocuments.length;
        total == 0 ? this.additionalDocumentsProgress = 0 : this.additionalDocumentsProgress = Math.round((fetchedDocuments / total) * 100);
        this.totalDocumentsProgress();
      }
    })
  }

  totalProfileProgress() {
    this.profileFormProgress = Math.floor((this.employeeFormProgress + this.personalFormProgress + this.addressFormProgress + this.contactFormProgress + this.additionalFormProgress) / 5);
    this.updateProfile.emit(this.profileFormProgress);
  }

  totalDocumentsProgress() {
    if (this.additionalDocumentsProgress == Infinity) {
      this.documentFormProgress = Math.floor((this.employeeDocumentsProgress + this.documentStarterKitFormProgress + this.adminDocumentsProgress) / 3);
      this.updateDocument.emit(this.documentFormProgress);
    }
    else {
      this.documentFormProgress = Math.floor((this.employeeDocumentsProgress + this.documentStarterKitFormProgress + this.adminDocumentsProgress + this.additionalDocumentsProgress) / 4);
      this.updateDocument.emit(this.documentFormProgress);
    }
  }
}
