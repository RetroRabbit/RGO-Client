import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { EmployeeCertificatesService } from 'src/app/services/hris/employee/employee-certificate.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';

@Component({
  selector: 'app-cv-document',
  templateUrl: './cv-document.component.html',
  styleUrls: ['./cv-document.component.css']
})
export class CvDocumentComponent {
  employeeId = this.route.snapshot.params['id'];
  usingSimpleProfile: boolean = false;
  loggedInProfile!: EmployeeData;
  name: string | undefined = '';
  surname: string | undefined = '';
  role: string | undefined = '';
  level: number | undefined = 0;
  nqf: number | undefined = 0;
  education: string | undefined = '';
  school: string | undefined = '';



  constructor(
    private employeeProfileService: EmployeeProfileService,
    private route: ActivatedRoute,
    public authAccessService: AuthAccessService,
    private employeeDataService: EmployeeDataService,
    private employeeQaulificationService: EmployeeQualificationsService,
    private employeeCertificationService: EmployeeCertificatesService,
    public navService: NavService,

  ) { }


  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    console.log(this.employeeId);
    if (this.employeeId == undefined) {
      this.employeeId = this.authAccessService.getUserId();
    }
    this.getEmployeeGeneralInformation();
    this.getQaulifications();
    this.getCertfications();

  }

  getEmployeeGeneralInformation() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: data => {
        this.name = data.name;
        this.surname = data.surname;
        this.role = data.employeeType?.name;
        this.level = data.level;
        console.log(data);
      }
    })

  }

  getEmployeeWorkExp() {

  }
  getQaulifications() {
    this.employeeQaulificationService.getEmployeeQualificationById(this.employeeId).subscribe({
      next: data => {
        console.log(data)
        this.education = data.fieldOfStudy;
        this.school = data.school;
      }
    })
  }

  getCertfications() {
    this.employeeCertificationService.getCertificationDetails(this.employeeId).subscribe({
      next: data => {
        console.log(data)

      }
    })
  }

  convertFileToBase64() {

  }

  downloadCertDocument(base64String: string, fileName: string) {
    const commaIndex = base64String.indexOf(',');

    if (commaIndex! + -1) {
      base64String = base64String.slice(commaIndex + 1);
    }

    const byteCharacters = atob(base64String);

    const byteNumbers = new ArrayBuffer(byteCharacters.length);
    const intArr = new Uint8Array(byteNumbers);

    for (let i = 0; i < byteCharacters.length; i++) {
      intArr[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}