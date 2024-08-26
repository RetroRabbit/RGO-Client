import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { SharedAccordionFunctionality } from '../../../shared-accordion-functionality';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { FileProcessingService } from 'src/app/services/hris/file-processing.service';

@Component({
  selector: 'app-career-summary-qualifications',
  templateUrl: './accordion-career-summary-qualifications.component.html',
  styleUrls: ['./accordion-career-summary-qualifications.component.css']
})

export class CareerSummaryQualificationsComponent {

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder,
    private employeeQualificationsService: EmployeeQualificationsService,
    public navservice: NavService,
    private fileProcessingService: FileProcessingService
  ) { }

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile, simpleEmployee: SimpleEmployee }

  isValidFile: boolean = false;
  isValidFileSize: boolean = false;
  fileUploaded: boolean = false;
  isDisabledUpload: boolean = true;
  isDisabledDownload: boolean = true;
  editQualifications: boolean = false;

  fileName: string = '';
  base64File: string = "";
  fileUrl: string = '';
  proofOfQualificationFinal: string = "";
  fileArrayBuffer!: ArrayBuffer;

  ngOnInit() {
    this.fetchQualificationsById();
  }

  //change everything to uint8array
  //gpt array buffer vs uint8array
  //services * change everything to uint8array if possible
  //string to buffer and visa versa methods should be uint8array


  fetchQualificationsById() {
    this.employeeQualificationsService.getEmployeeQualificationById(this.employeeProfile.employeeDetails.id as number).subscribe({
      next: (data) => {
        this.sharedAccordionFunctionality.employeeQualification = data;
        // const newByteArray = this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);
        // const decerializedArray = this.fileProcessingService.deserializeAndDecompressFile(newByteArray);
        // this.sharedAccordionFunctionality.employeeQualification.proofOfQualification = this.fileProcessingService.byteArrayToString(decerializedArray);
        
        if (this.sharedAccordionFunctionality.employeeQualification) {
          if (data.year && data.year.endsWith("-01-01")) {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year.substring(0, 4);
          } else {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year;
          }
        }
        this.initializeForm();
        this.sharedAccordionFunctionality.calculateQualificationProgress();
        this.sharedAccordionFunctionality.totalCareerProgress();
      },
    })
  }

  initializeForm() {
    if (!this.sharedAccordionFunctionality.employeeQualification) {
      this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
        highestQualification: ["", Validators.required],
        school: ["", Validators.required],
        fieldOfStudy: ["", Validators.required],
        year: ["", [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
        proofOfQualification: [""],
      });
    } else {
      this.sharedAccordionFunctionality.employeeQualificationForm = this.fb.group({
        highestQualification: [this.sharedAccordionFunctionality.employeeQualification.highestQualification, Validators.required],
        school: [this.sharedAccordionFunctionality.employeeQualification.school, Validators.required],
        fieldOfStudy: [this.sharedAccordionFunctionality.employeeQualification.fieldOfStudy, Validators.required],
        year: [this.sharedAccordionFunctionality.employeeQualification.year, [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
        proofOfQualification: [this.sharedAccordionFunctionality.employeeQualification.proofOfQualification],
      });
    }
    this.editQualifications = false;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.calculateQualificationProgress();
    this.sharedAccordionFunctionality.totalCareerProgress();
    this.fileName = this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.documentName : '';
    this.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualifications", true)
  }

  saveQualificationsEdit() {
    if (this.sharedAccordionFunctionality.employeeQualificationForm.valid) {
      const saveQualification: EmployeeQualifications = {
        id: this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.id : 0,
        employeeId: this.employeeProfile.employeeDetails.id as number,
        highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
        fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
        year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value + "-01-01",
        nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        proofOfQualification: this.proofOfQualificationFinal,
        documentName: this.fileName,
      };

      console.log("============================");
      console.log("The base 64 file size", this.base64File.length);

      const updatedQualification: EmployeeQualifications = {
        id: this.sharedAccordionFunctionality.employeeQualification ? this.sharedAccordionFunctionality.employeeQualification.id : 0,
        employeeId: this.employeeProfile.employeeDetails.id as number,
        highestQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        school: this.sharedAccordionFunctionality.employeeQualificationForm.get("school")?.value,
        fieldOfStudy: this.sharedAccordionFunctionality.employeeQualificationForm.get("fieldOfStudy")?.value,
        year: this.sharedAccordionFunctionality.employeeQualificationForm.get("year")?.value + "-01-01",
        nqfLevel: this.sharedAccordionFunctionality.employeeQualificationForm.get("highestQualification")?.value,
        proofOfQualification: this.sharedAccordionFunctionality.employeeQualificationForm.get("proofOfQualification")?.value,
        documentName: this.fileName,
      };

      const qualificationObservable = updatedQualification.id > 0
        ? this.employeeQualificationsService.updateEmployeeQualification(updatedQualification, updatedQualification.id)
        : this.employeeQualificationsService.saveEmployeeQualification(saveQualification);
      qualificationObservable.subscribe({
        next: () => {
          this.snackBarService.showSnackbar(saveQualification.id > 0 ? "Updated" : "Saved", "snack-success");
          this.sharedAccordionFunctionality.calculateQualificationProgress();
          this.sharedAccordionFunctionality.totalCareerProgress();
        },
        error: (er) => this.snackBarService.showError(er),
        complete: () => this.fetchQualificationsById()
      });
    } else {
      this.snackBarService.showSnackbar("Please Fill in the Required Fields", "snack-error");
    }
  }

  editQualificationsDetails() {
    this.editQualifications = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.isDisabledUpload = false;
    this.isDisabledDownload = false;
  }

  cancelQualificationsEdit() {
    this.editQualifications = false;
    this.isDisabledUpload = true;
    this.isDisabledDownload = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.disable();
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.fileUploaded = true;
      const file = event.target.files[0];

      this.fileProcessingService.fileToArrayBuffer(file, (arrayBuffer) => {
        // Log the size of the original ArrayBuffer
        console.log("Original ArrayBuffer size (in bytes):", arrayBuffer.byteLength);

        // Compress and serialize the ArrayBuffer
        const compressedData = this.fileProcessingService.compressAndSerializeFile(arrayBuffer);
        this.fileArrayBuffer = this.fileProcessingService.compressAndSerializeFile(arrayBuffer);
        this.proofOfQualificationFinal = this.fileProcessingService.arrayBufferToBase64(this.fileArrayBuffer);

        // Log the size of the compressed data
        console.log("Compressed data size (in bytes):", compressedData.byteLength);
        console.log("Compressed data: ", compressedData);

        console.log("compressedB64 size: ", this.proofOfQualificationFinal.length);
        console.log("This is the base64 from the compressed data: ", this.proofOfQualificationFinal);
        

        // Decompress and deserialize the data back to an ArrayBuffer
        const deserializedArrayBuffer = this.fileProcessingService.deserializeAndDecompressFile(compressedData);
        console.log("Decompressed data size (in bytes)", deserializedArrayBuffer.byteLength);

        // Reconstruct the file and trigger the download
        // this.fileProcessingService.downloadArrayBufferAsFile(deserializedArrayBuffer, file.name, file.type);
      });

      this.fileName = file.name;
      if (this.validateFile(file)) {
        this.fileConverter(file);
      }
    }
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.isValidFile = false;
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.isValidFileSize = false;
      return false;
    }
    this.isValidFileSize = true;
    return true;
  }

  fileConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.base64File = reader.result as string;
    });
    reader.readAsDataURL(file);
  }

  // downloadFile(proofOfQualification: string | ArrayBuffer | undefined, fileName: string | undefined) {
  //   if (!proofOfQualification || !fileName) {
  //       console.error('Invalid file data or filename.');
  //       return;
  //   }

  //   let arrayBuffer: ArrayBuffer;

  //   // If the proofOfQualification is a string, convert it to an ArrayBuffer
  //   if (typeof proofOfQualification === 'string') {
  //       arrayBuffer = this.convertStringToArrayBuffer(proofOfQualification);
  //   } else {
  //       arrayBuffer = proofOfQualification;
  //   }

  //   // Assuming arrayBuffer is now ready for download
  //   const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  //   const url = window.URL.createObjectURL(blob);

  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();

  //   window.URL.revokeObjectURL(url);
  // }

  // // Helper method to convert string (e.g., base64) to ArrayBuffer
  // convertStringToArrayBuffer(input: string): ArrayBuffer {
  //     const binaryString = window.atob(input);
  //     const len = binaryString.length;
  //     const bytes = new Uint8Array(len);

  //     for (let i = 0; i < len; i++) {
  //         bytes[i] = binaryString.charCodeAt(i);
  //     }

  //     return bytes.buffer;
  // }


  // downloadFile(arrayBuffer: ArrayBuffer | undefined, fileName: string): void {
  //   // Check if the arrayBuffer is defined
  //   if (arrayBuffer) {
  //     // Create a Blob from the arrayBuffer with the appropriate type (e.g., application/pdf)
  //     const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      
  //     // Create a download link
  //     const url = window.URL.createObjectURL(blob);
  //     const anchor = document.createElement('a');
      
  //     // Set the href and download attributes for the link
  //     anchor.href = url;
  //     anchor.download = fileName || 'downloaded-file.pdf';
      
  //     // Append the anchor to the body to ensure it is clickable
  //     document.body.appendChild(anchor);
      
  //     // Programmatically click the anchor to trigger the download
  //     anchor.click();
      
  //     // Clean up by removing the anchor from the DOM and revoking the object URL
  //     document.body.removeChild(anchor);
  //     window.URL.revokeObjectURL(url);
  //   } else {
  //     // Handle the case where arrayBuffer is undefined
  //     console.error("Failed to download file: ArrayBuffer is undefined.");
  //     // Optionally, show a user-friendly message here
  //   }
  // }
  

  // downloadFile() {
  //   const compressedBase64 = this.sharedAccordionFunctionality.employeeQualification.proofOfQualification;
  
  //   // Decode base64 to Uint8Array
  //   const compressedByteString = atob(compressedBase64);
  //   const compressedArrayBuffer = new ArrayBuffer(compressedByteString.length);
  //   const compressedUint8Array = new Uint8Array(compressedArrayBuffer);
    
  //   for (let i = 0; i < compressedByteString.length; i++) {
  //     compressedUint8Array[i] = compressedByteString.charCodeAt(i);
  //   }
  
  //   // Decompress the data
  //   const decompressedArrayBuffer = this.fileProcessingService.deserializeAndDecompressFile(compressedUint8Array);
  
  //   // Create a Blob for the decompressed file
  //   const blob = new Blob([decompressedArrayBuffer], { type: 'application/pdf' });
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = this.fileName;
  //   link.click();
  // }

  downloadFile() {
    const commaIndex = this.base64File.indexOf(',');
    if (commaIndex !== -1) {
      this.base64File = this.base64File.slice(commaIndex + 1);
    }
    const byteString = atob(this.base64File);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.fileName;
    link.click();
  }

  checkPropertyPermissions(fieldNames: string[], table: string, initialLoad: boolean): void {
    fieldNames.forEach(fieldName => {
      let control: AbstractControl<any, any> | null = null;
      control = this.sharedAccordionFunctionality.personalDetailsForm.get(fieldName);
      if (control) {
        switch (this.sharedPropertyAccessService.checkPermission(table, fieldName)) {
          case PropertyAccessLevel.none:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = false;
            break;
          case PropertyAccessLevel.read:
            if (!initialLoad)
              control.disable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          case PropertyAccessLevel.write:
            if (!initialLoad)
              control.enable();
            this.sharedPropertyAccessService.employeeProfilePermissions[fieldName] = true;
            break;
          default:
            if (!initialLoad)
              control.enable();
        }
      }
    });
  }
}