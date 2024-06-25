import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { filter } from 'rxjs';
import { EmployeeCertificates } from 'src/app/models/hris/employee-certificates.interface';
import { EmployeeData } from 'src/app/models/hris/employee-data.interface';
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

  employeeWorkexp: WorkExperience[] = [];
  employeeCert: EmployeeCertificates[] = [];
  skills: any = [];
  filteredSkills: any = [];
  displaySkills: string = '';
  usingSimpleProfile: boolean = false;
  loggedInProfile!: EmployeeData;
  name: string | undefined = '';
  surname: string | undefined = '';
  role: string | undefined = '';
  level: number | undefined = 0;
  education: string | undefined = '';
  school: string | undefined = '';
  nqf: string | undefined = '';
  skillSet: any | undefined = '';
  issueDate: any | undefined = '';
  endDate: any | undefined = '';
  numberOfYears: any | undefined = '';
  pronoun: string | undefined = '';

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
    this.getEmployeeData();

  }

  getEmployeeGeneralInformation() {
    this.employeeProfileService.getEmployeeById(this.employeeId).subscribe({
      next: data => {
        this.name = data.name;
        this.surname = data.surname;
        this.role = data.employeeType?.name;
        this.level = data.level;
        console.log(data);
        if (data.gender == 1) {
          this.pronoun = 'He'
        }
        else if (data.gender == 0) {
          this.pronoun = 'Her'
        }
        else {
          this.pronoun = 'They'
        }
      }
    })

  }
  getEmployeeData() {
    this.employeeDataService.getEmployeeData(this.employeeId).subscribe({
      next: data => {
        this.nqf = data[2].value;
      }
    })
  }

  getYears(date1: any) {
    const newDate1Obj = new Date(date1);
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
          this.employeeWorkexp.push(element);
          const newDate = new Date(element.endDate);
          const year = newDate.getFullYear();
          this.endDate = year;
          this.getYears(element.startDate);
          element.skillSet?.forEach(item => {
            this.skills.push(item);

          });
        });
        this.filteredSkills = [...new Set(this.skills)];
        // this.displaySkills = this.filteredSkills.map((skill: any) => skill.toUpperCase());
      }
    })
  }

  getQaulifications() {
    this.employeeQaulificationService.getEmployeeQualificationById(this.employeeId).subscribe({
      next: data => {
        console.log(data)
        this.school = data.school;
        this.education = data.fieldOfStudy;
      }
    })
  }

  getCertfications() {
    this.employeeCertificationService.getCertificationDetails(this.employeeId).subscribe({
      next: data => {
        console.log(data);
        data.forEach((item) => {
          this.employeeCert.push(item);
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
    let srcwidth = document.querySelector<HTMLElement>("#doc-page")!.scrollWidth;
    var btn = document.querySelector<HTMLElement>("#button-pdf")!;
    //var content: any = document.getElementById('doc-page')?;

    // var string = doc.output('datauristring');
    var newWindow = window.open();

    // Output as Data URI

    //   await doc.html(docHTML, {

    //     callback: (doc) => {
    //       // return doc;
    //       printButton?.addEventListener('click', function () {


    //       });
    //     },
    //   });


    // }
    //var newWin: = window.frames["printf"];

    // newWindow?.document.write(content);

    // newWindow?.print();
    // newWindow?.close();
    // document.getElementById("printf").contentWindow.print();

  }
  printIframeContent() {
    var iframe = document.getElementById("printableIframe");
    iframe?.focus(); // Focus the iframe before printing
    window.print();
  }
}
