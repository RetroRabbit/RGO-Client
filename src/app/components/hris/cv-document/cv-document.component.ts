import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { WorkExperience } from 'src/app/models/hris/work-experience.interface';
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
  selectedEmployee!: EmployeeProfile;
  employeeProfile!: EmployeeProfile;
  employeeWorkExp: WorkExperience[] = [];
  employeeCertificate: EmployeeCertificates[] = [];
  loggedInProfile!: EmployeeData;
  skills: string[] = [];
  filteredSkills: string[] = [];
  name: string | undefined = '';
  surname: string | undefined = '';
  role: string | undefined = '';
  level: number | undefined = 0;
  education: string | undefined = '';
  school: string | undefined = '';
  nqf: number = 0;
  skillSet: string | undefined = '';
  issueDate: number | undefined = 0;
  endDate: number | undefined = 0;
  numberOfYears: string | undefined = '';
  pronoun: string | undefined = '';
  isLoading: boolean = true;

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private route: ActivatedRoute,
    public authAccessService: AuthAccessService,
    private employeeQaulificationService: EmployeeQualificationsService,
    private employeeCertificationService: EmployeeCertificatesService,
    private employeeWorkExperienceService: WorkExperienceService,
    public navService: NavService,
  ) { }

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    this.loggedInProfile = this.navService.getEmployeeProfile();

    if (this.employeeId == undefined) {
      this.employeeId = this.authAccessService.getUserId();
    }
    this.getEmployeeInformation();
    this.getQualifications();
    this.getCertifications();
    this.getEmployeeWorkExp();
  }

  getEmployeeInformation() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: data => {
        this.name = data.name;
        this.surname = data.surname;
        this.role = data.employeeType?.name;
        this.level = data.level;
        this.getExprienceYears(data.engagementDate);
      }
    })
  }

  getExprienceYears(date: any) {
    const newDate1Obj = new Date(date);
    const newDate2Obj = new Date();

    let years = newDate2Obj.getFullYear() - newDate1Obj.getFullYear();
    let months = newDate2Obj.getMonth() - newDate1Obj.getMonth();

    months = (months + 12) % 12;
    years -= Math.floor(months / 12);
    const numYears = (years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : 0 + ' years' + (months > 0 ? "" + ` ${months} ${months === 1 ? 'month' : 'months'}` : ''));
    this.numberOfYears = numYears;
  }

  getEmployeeWorkExp() {
    this.employeeWorkExperienceService.getWorkExperience(this.employeeId).subscribe({
      next: data => {
        data.forEach((element) => {
          this.employeeWorkExp.push(element);
          const newDate = new Date(element.endDate);
          const year = newDate.getFullYear();
          this.endDate = year;
          element.skillSet?.forEach(item => {
            this.skills.push(item);
          });
        });
        this.filteredSkills = [...new Set(this.skills)];
      }
    })
  }

  getQualifications() {
    this.employeeQaulificationService.getEmployeeQualificationById(this.employeeId).subscribe({
      next: data => {
        this.school = data.school;
        this.education = data.fieldOfStudy;
        this.nqf = data.highestQualification;
      }
    })
  }

  getCertifications() {
    this.employeeCertificationService.getCertificationDetails(this.employeeId).subscribe({
      next: data => {
        data.forEach((item) => {
          this.employeeCertificate.push(item);
          const newDate = new Date(item.issueDate);
          const year = newDate.getFullYear();
          this.issueDate = year;
        })
      }
    })
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

  async downloadPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    var docHTML = document.querySelector<HTMLElement>("#doc-page")!;
    await doc.html(docHTML, {
      callback: () => {
        window.print();
      },
    });
  }
}
