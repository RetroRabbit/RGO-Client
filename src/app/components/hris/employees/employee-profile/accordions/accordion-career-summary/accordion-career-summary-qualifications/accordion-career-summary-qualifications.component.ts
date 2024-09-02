import { Component, HostListener, Input } from '@angular/core';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
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

  @Input() employeeProfile!: { employeeDetails: EmployeeProfile }

  isValidFile: boolean = false;
  isValidFileSize: boolean = false;
  fileUploaded: boolean = false;
  isDisabledUpload: boolean = true;
  isDisabledDownload: boolean = true;
  editQualifications: boolean = false;

  fileName: string = '';
  fileDownloadName: string = '';
  fileDownloadType: string = '';
  base64File: string = "";
  fileUrl: string = '';
  proofOfQualificationFinal: string = "";
  proofOfQualificationDecompressed!: ArrayBuffer;
  dbQualification: string = '';
  deserializedArrayBufferStore!: ArrayBuffer;
  compressedByteArray!: Uint8Array;

  testString: string = '';

  async ngOnInit() {
    await this.fetchQualificationsById();
  }

  async fetchQualificationsById() {
    this.employeeQualificationsService.getEmployeeQualificationById(this.employeeProfile.employeeDetails.id as number).subscribe({
      next: async (data) => {
        this.sharedAccordionFunctionality.employeeQualification = data;
        //fetching qualification in db
        this.dbQualification = data.proofOfQualification;
        console.log("The database qualification: ", this.dbQualification);
        //==== decerialised logic before
        // this.compressedByteArray = this.fileProcessingService.stringToByteArray(this.dbQualification);
        // this.deserializedArrayBufferStore = this.fileProcessingService.deserializeAndDecompressFile(this.compressedByteArray);
        // console.log("This is the deserialized array buffer from the DB: ", this.deserializedArrayBufferStore);

        if (this.sharedAccordionFunctionality.employeeQualification) {
          if (data.year && data.year.endsWith("-01-01")) {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year.substring(0, 4);
          } else {
            this.sharedAccordionFunctionality.employeeQualification.year = data.year;
          }
        }
        await this.initializeForm();
        this.sharedAccordionFunctionality.calculateQualificationProgress();
        this.sharedAccordionFunctionality.totalCareerProgress();
      },
    })
  }

  async initializeForm() {
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
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualification", true , this.sharedAccordionFunctionality.employeeQualificationForm , this.employeeProfile.employeeDetails.email!)
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
        proofOfQualification: this.sharedAccordionFunctionality.employeeQualification.proofOfQualification,
        documentName: this.fileName,
      };

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

  async editQualificationsDetails() {
    this.editQualifications = true;
    this.sharedAccordionFunctionality.employeeQualificationForm.enable();
    this.isDisabledUpload = false;
    this.isDisabledDownload = false;
    await this.sharedPropertyAccessService.checkPropertyPermissions(Object.keys(this.sharedAccordionFunctionality.employeeQualificationForm.controls), "EmployeeQualification", false , this.sharedAccordionFunctionality.employeeQualificationForm , this.employeeProfile.employeeDetails.email!)
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
        console.log("Original ArrayBuffer: ", arrayBuffer);
        console.log("Original ArrayBuffer size: ", arrayBuffer.byteLength);

        // Compress and serialize the ArrayBuffer
        const compressedData = this.fileProcessingService.compressAndSerializeFile(arrayBuffer);
        // this.fileArrayBuffer = this.fileProcessingService.compressAndSerializeFile(arrayBuffer); //=====
        console.log("This is the compressed Uint8: ", compressedData);
        
        // this.proofOfQualificationFinal = this.fileProcessingService.byteArrayToString(compressedData);
        this.sharedAccordionFunctionality.employeeQualification.proofOfQualification = this.fileProcessingService.byteArrayToString(compressedData);
        this.fileDownloadName = file.name;
        this.fileDownloadType = file.type;

        console.log("This is the shared accordion after compressing", this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);

        this.testString = this.sharedAccordionFunctionality.employeeQualification.proofOfQualification;
        // Log the size of the compressed data
        // console.log("Compressed data size (in bytes):", compressedData.byteLength);
        // console.log("Compressed data: ", compressedData);

        // console.log("compressedB64 size: ", this.proofOfQualificationFinal.length);
        // console.log("This is the base64 from the compressed data: ", this.proofOfQualificationFinal);
        

        // Decompress and deserialize the data back to an ArrayBuffer
        const deserializedArrayBuffer = this.fileProcessingService.deserializeAndDecompressFile(compressedData);
        // console.log("Decompressed data size (in bytes)", deserializedArrayBuffer.byteLength);

        // console.log("shared acoordion proof: ", this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);

        // Reconstruct the file and trigger the download
        this.fileProcessingService.downloadArrayBufferAsFile(deserializedArrayBuffer, file.name, file.type);
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

  downloadFile() {
    console.log("Download works");

    if(this.testString == this.sharedAccordionFunctionality.employeeQualification?.proofOfQualification)
    {
      console.log("true");
    } console.log("false");
    if (this.sharedAccordionFunctionality.employeeQualification?.proofOfQualification) {
      // Convert the stored string to a byte array
      // const byteArray = this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);
      // console.log("This is the byte array on download: ", byteArray);
      // Decompress and deserialize the byte array
      // this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification?.proofOfQualification);

      console.log("from the db before decompressing: ", this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);
      // const stringToByte = this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);
      const decompressedArrayBuffer = this.fileProcessingService.deserializeAndDecompressFile(this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification.proofOfQualification));
      
      console.log("Decompressed proof of Qualification: ", decompressedArrayBuffer);
  
      // Download the file
      this.fileProcessingService.downloadArrayBufferAsFile(decompressedArrayBuffer, this.fileDownloadName, this.fileDownloadType);
    } else {
      console.error("No proof of qualification data available to download.");
    }
  }

  // downloadFile() {
  //   // if (this.fileArrayBuffer) {
  //     // Deserialize and decompress the ArrayBuffer


  //     //The file fetched from the db is a compressed b64 string
  //     //convert to unitarray and then decesrialize
  //     //download the file
  //     const stringToByte = this.fileProcessingService.stringToByteArray(this.sharedAccordionFunctionality.employeeQualification.proofOfQualification);
  //     this.proofOfQualificationDecompressed = this.fileProcessingService.deserializeAndDecompressFile(stringToByte);

  //     console.log("decompressed proof of Qualification: ", this.proofOfQualificationDecompressed);

  //     //this.fileProcessingService.downloadArrayBufferAsFile(this.proofOfQualificationDecompressed, this.fileDownloadName, this.fileDownloadType);
      
      
  //     //array buffer to base 64 string
  //     //array buffer to string 
  //     //string to uintarray


  //     //takes in uint array
  //     // const deserializedArrayBuffer = this.fileProcessingService.deserializeAndDecompressFile();
  
  //     // console.log("Decompressed data size (in bytes):", deserializedArrayBuffer.byteLength);
  
  //     // Trigger the download
  //     // this.fileProcessingService.downloadArrayBufferAsFile(deserializedArrayBuffer, this.fileName, 'application/pdf');
  //   // } else {
  //   //   this.snackBarService.showSnackbar("No file to download", "snack-error");
  //   // }
  // }
  

  // downloadFile() {
  //   const commaIndex = this.base64File.indexOf(',');
  //   if (commaIndex !== -1) {
  //     this.base64File = this.base64File.slice(commaIndex + 1);
  //   }
  //   const byteString = atob(this.base64File);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const intArray = new Uint8Array(arrayBuffer);

  //   for (let i = 0; i < byteString.length; i++) {
  //     intArray[i] = byteString.charCodeAt(i);
  //   }

  //   const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = this.fileName;
  //   link.click();
  // }
}