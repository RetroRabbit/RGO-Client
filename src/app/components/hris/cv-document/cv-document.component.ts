import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { EmployeeCertificatesService } from 'src/app/services/hris/employee/employee-certificate.service';
import { EmployeeDataService } from 'src/app/services/hris/employee/employee-data.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
import { EmployeeQualificationsService } from 'src/app/services/hris/employee/employee-qualifications.service';
import { WorkExperienceService } from 'src/app/services/hris/employee/employee-work-experience.service';
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
  client: string | undefined = '';
  projectName: string | undefined = '';
  projectRole: string | undefined = '';
  date: any | undefined = '';
  issueDate: any | undefined = '';
  certificateName: string | undefined = '';
  organizationName: string | undefined = '';
  skillSet: any | undefined = '';


  constructor(
    private employeeProfileService: EmployeeProfileService,
    private route: ActivatedRoute,
    public authAccessService: AuthAccessService,
    private employeeDataService: EmployeeDataService,
    private employeeQaulificationService: EmployeeQualificationsService,
    private employeeCertificationService: EmployeeCertificatesService,
    private employeeWorkExperienceService: WorkExperienceService,
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
    this.getEmployeeWorkExp();

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
    this.employeeWorkExperienceService.getWorkExperience(this.employeeId).subscribe({
      next: data => {
        console.log(data);
        this.client = data[0].clientName;
        this.projectName = data[0].projectName;
        const newDate = new Date(data[0].endDate);
        this.date = newDate.getFullYear();
        this.skillSet = data[0].skillSet;

      }
    })
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
        console.log(data);
        this.organizationName = data[0].issueOrganization;
        this.certificateName = data[0].certificateName;
        const newDate = new Date(data[0].issueDate);
        this.issueDate = newDate.getFullYear();




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