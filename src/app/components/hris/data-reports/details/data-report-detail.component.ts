import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { DataReportColumns } from 'src/app/models/hris/data-report-columns.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { NavItem } from 'src/app/models/hris/report-menu-item.interface';


import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-data-report-detail',
  templateUrl: './data-report-detail.component.html',
  styleUrls: ['./data-report-detail.component.css']
})

export class DataReportDetailComponent {

  baseUrl: string;
  dataReportCode: string;
  isLoading: boolean = false;
  dataObjects: DataReport = {};
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';

  navItems: NavItem[] = [
    {
      id: 0,
      name: "+",
      prop: "+",
      children: [
        {
          "id": 1,
          "name": "EmployeeNumber",
          "prop": "EmployeeNumber",
          "children": []
        },
        {
          "id": 2,
          "name": "TaxNumber",
          "prop": "TaxNumber",
          "children": []
        },
        {
          "id": 3,
          "name": "EngagementDate",
          "prop": "EngagementDate",
          "children": []
        },
        {
          "id": 4,
          "name": "TerminationDate",
          "prop": "TerminationDate",
          "children": []
        },
        {
          "id": 5,
          "name": "Disability",
          "prop": "Disability",
          "children": []
        },
        {
          "id": 6,
          "name": "DisabilityNotes",
          "prop": "DisabilityNotes",
          "children": []
        },
        {
          "id": 7,
          "name": "Level",
          "prop": "Level",
          "children": []
        },
        {
          "id": 8,
          "name": "Notes",
          "prop": "Notes",
          "children": []
        },
        {
          "id": 9,
          "name": "LeaveInterval",
          "prop": "LeaveInterval",
          "children": []
        },
        {
          "id": 10,
          "name": "SalaryDays",
          "prop": "SalaryDays",
          "children": []
        },
        {
          "id": 11,
          "name": "PayRate",
          "prop": "PayRate",
          "children": []
        },
        {
          "id": 12,
          "name": "Salary",
          "prop": "Salary",
          "children": []
        },
        {
          "id": 13,
          "name": "Name",
          "prop": "Name",
          "children": []
        },
        {
          "id": 14,
          "name": "Initials",
          "prop": "Initials",
          "children": []
        },
        {
          "id": 15,
          "name": "Surname",
          "prop": "Surname",
          "children": []
        },
        {
          "id": 16,
          "name": "DateOfBirth",
          "prop": "DateOfBirth",
          "children": []
        },
        {
          "id": 17,
          "name": "CountryOfBirth",
          "prop": "CountryOfBirth",
          "children": []
        },
        {
          "id": 18,
          "name": "Nationality",
          "prop": "Nationality",
          "children": []
        },
        {
          "id": 19,
          "name": "IdNumber",
          "prop": "IdNumber",
          "children": []
        },
        {
          "id": 20,
          "name": "PassportNumber",
          "prop": "PassportNumber",
          "children": []
        },
        {
          "id": 21,
          "name": "PassportExpirationDate",
          "prop": "PassportExpirationDate",
          "children": []
        },
        {
          "id": 22,
          "name": "PassportCountryIssue",
          "prop": "PassportCountryIssue",
          "children": []
        },
        {
          "id": 23,
          "name": "Race",
          "prop": "Race",
          "children": []
        },
        {
          "id": 24,
          "name": "Gender",
          "prop": "Gender",
          "children": []
        },
        {
          "id": 25,
          "name": "Photo",
          "prop": "Photo",
          "children": []
        },
        {
          "id": 26,
          "name": "Email",
          "prop": "Email",
          "children": []
        },
        {
          "id": 27,
          "name": "PersonalEmail",
          "prop": "PersonalEmail",
          "children": []
        },
        {
          "id": 28,
          "name": "CellphoneNo",
          "prop": "CellphoneNo",
          "children": []
        },
        {
          "id": 29,
          "name": "HouseNo",
          "prop": "HouseNo",
          "children": []
        },
        {
          "id": 30,
          "name": "EmergencyContactName",
          "prop": "EmergencyContactName",
          "children": []
        },
        {
          "id": 31,
          "name": "EmergencyContactNo",
          "prop": "EmergencyContactNo",
          "children": []
        },
        {
          "id": 32,
          "name": "Active",
          "prop": "Active",
          "children": []
        },
        {
          "id": 33,
          "name": "InactiveReason",
          "prop": "InactiveReason",
          "children": []
        },
        {
          "id": 34,
          "name": "EmployeeType",
          "prop": "EmployeeType",
          "children": [
            {
              "id": 35,
              "name": "Name",
              "prop": "Name",
              "children": []
            }
          ]
        },
        {
          "id": 36,
          "name": "ClientAssigned",
          "prop": "ClientAssigned",
          "children": [
            {
              "id": 37,
              "name": "Name",
              "prop": "Name",
              "children": []
            }
          ]
        },
        {
          "id": 38,
          "name": "PhysicalAddress",
          "prop": "PhysicalAddress",
          "children": [
            {
              "id": 39,
              "name": "UnitNumber",
              "prop": "UnitNumber",
              "children": []
            },
            {
              "id": 40,
              "name": "ComplexName",
              "prop": "ComplexName",
              "children": []
            },
            {
              "id": 41,
              "name": "StreetName",
              "prop": "StreetName",
              "children": []
            },
            {
              "id": 42,
              "name": "StreetNumber",
              "prop": "StreetNumber",
              "children": []
            },
            {
              "id": 43,
              "name": "SuburbOrDistrict",
              "prop": "SuburbOrDistrict",
              "children": []
            },
            {
              "id": 44,
              "name": "City",
              "prop": "City",
              "children": []
            },
            {
              "id": 45,
              "name": "Country",
              "prop": "Country",
              "children": []
            },
            {
              "id": 46,
              "name": "Province",
              "prop": "Province",
              "children": []
            },
            {
              "id": 47,
              "name": "PostalCode",
              "prop": "PostalCode",
              "children": []
            }
          ]
        },
        {
          "id": 48,
          "name": "PostalAddress",
          "prop": "PostalAddress",
          "children": [
            {
              "id": 49,
              "name": "UnitNumber",
              "prop": "UnitNumber",
              "children": []
            },
            {
              "id": 50,
              "name": "ComplexName",
              "prop": "ComplexName",
              "children": []
            },
            {
              "id": 51,
              "name": "StreetName",
              "prop": "StreetName",
              "children": []
            },
            {
              "id": 52,
              "name": "StreetNumber",
              "prop": "StreetNumber",
              "children": []
            },
            {
              "id": 53,
              "name": "SuburbOrDistrict",
              "prop": "SuburbOrDistrict",
              "children": []
            },
            {
              "id": 54,
              "name": "City",
              "prop": "City",
              "children": []
            },
            {
              "id": 55,
              "name": "Country",
              "prop": "Country",
              "children": []
            },
            {
              "id": 56,
              "name": "Province",
              "prop": "Province",
              "children": []
            },
            {
              "id": 57,
              "name": "PostalCode",
              "prop": "PostalCode",
              "children": []
            }
          ]
        },
        {
          "id": 58,
          "name": "EmployeeCertification",
          "prop": "EmployeeCertification",
          "children": [
            {
              "id": 59,
              "name": "Capacity",
              "prop": "Capacity",
              "children": []
            },
            {
              "id": 60,
              "name": "CertificateName",
              "prop": "CertificateName",
              "children": []
            },
            {
              "id": 61,
              "name": "CertificateDocument",
              "prop": "CertificateDocument",
              "children": []
            },
            {
              "id": 62,
              "name": "IssueOrganization",
              "prop": "IssueOrganization",
              "children": []
            },
            {
              "id": 63,
              "name": "IssueDate",
              "prop": "IssueDate",
              "children": []
            },
            {
              "id": 64,
              "name": "DocumentName",
              "prop": "DocumentName",
              "children": []
            }
          ]
        },
        {
          "id": 65,
          "name": "EmployeeDocument",
          "prop": "EmployeeDocument",
          "children": [
            {
              "id": 66,
              "name": "Capacity",
              "prop": "Capacity",
              "children": []
            },
            {
              "id": 67,
              "name": "Reference",
              "prop": "Reference",
              "children": []
            },
            {
              "id": 68,
              "name": "FileName",
              "prop": "FileName",
              "children": []
            },
            {
              "id": 69,
              "name": "FileCategory",
              "prop": "FileCategory",
              "children": []
            },
            {
              "id": 70,
              "name": "EmployeeFileCategory",
              "prop": "EmployeeFileCategory",
              "children": []
            },
            {
              "id": 71,
              "name": "AdminFileCategory",
              "prop": "AdminFileCategory",
              "children": []
            },
            {
              "id": 72,
              "name": "Blob",
              "prop": "Blob",
              "children": []
            },
            {
              "id": 73,
              "name": "Status",
              "prop": "Status",
              "children": []
            },
            {
              "id": 74,
              "name": "UploadDate",
              "prop": "UploadDate",
              "children": []
            },
            {
              "id": 75,
              "name": "Reason",
              "prop": "Reason",
              "children": []
            },
            {
              "id": 76,
              "name": "CounterSign",
              "prop": "CounterSign",
              "children": []
            },
            {
              "id": 77,
              "name": "DocumentType",
              "prop": "DocumentType",
              "children": []
            },
            {
              "id": 78,
              "name": "LastUpdatedDate",
              "prop": "LastUpdatedDate",
              "children": []
            }
          ]
        },
        {
          "id": 79,
          "name": "EmployeeQualification",
          "prop": "EmployeeQualification",
          "children": [
            {
              "id": 80,
              "name": "Capacity",
              "prop": "Capacity",
              "children": []
            },
            {
              "id": 81,
              "name": "HighestQualification",
              "prop": "HighestQualification",
              "children": []
            },
            {
              "id": 82,
              "name": "School",
              "prop": "School",
              "children": []
            },
            {
              "id": 83,
              "name": "FieldOfStudy",
              "prop": "FieldOfStudy",
              "children": []
            },
            {
              "id": 84,
              "name": "NQFLevel",
              "prop": "NQFLevel",
              "children": []
            },
            {
              "id": 85,
              "name": "Year",
              "prop": "Year",
              "children": []
            },
            {
              "id": 86,
              "name": "ProofOfQualification",
              "prop": "ProofOfQualification",
              "children": []
            },
            {
              "id": 87,
              "name": "DocumentName",
              "prop": "DocumentName",
              "children": []
            }
          ]
        },
        {
          "id": 88,
          "name": "EmployeeSalaryDetails",
          "prop": "EmployeeSalaryDetails",
          "children": [
            {
              "id": 89,
              "name": "Employee",
              "prop": "Employee",
              "children": []
            },
            {
              "id": 90,
              "name": "Salary",
              "prop": "Salary",
              "children": []
            },
            {
              "id": 91,
              "name": "MinSalary",
              "prop": "MinSalary",
              "children": []
            },
            {
              "id": 92,
              "name": "MaxSalary",
              "prop": "MaxSalary",
              "children": []
            },
            {
              "id": 93,
              "name": "Remuneration",
              "prop": "Remuneration",
              "children": []
            },
            {
              "id": 94,
              "name": "Band",
              "prop": "Band",
              "children": []
            },
            {
              "id": 95,
              "name": "Contribution",
              "prop": "Contribution",
              "children": []
            },
            {
              "id": 96,
              "name": "SalaryUpdateDate",
              "prop": "SalaryUpdateDate",
              "children": []
            }
          ]
        },
        {
          "id": 97,
          "name": "AuthUserId",
          "prop": "AuthUserId",
          "children": []
        }
      ]
    }
  ];

  constructor(private router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService) {
    this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
    this.dataReportCode = this.route.snapshot.params["code"]
  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.isLoading = true;
    this.onResize();
    this.dataReportCode = this.route.snapshot.params["id"]
    this.populateReportData(this.dataReportCode);
  }

  fetchReportData(reportCode: string): Observable<DataReport> {
    return this.httpClient.get<DataReport>(`${this.baseUrl}/get-data-report?code=${reportCode}`);
  }

  updateReportData(reportInput: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/update-report-input`, reportInput)
  }

  populateReportData(dataReportCode: string) {
    this.fetchReportData(dataReportCode).subscribe({
      next: data => {
        this.dataObjects.reportId = data.reportId;
        this.dataObjects.reportName = data.reportName;
        this.dataObjects.columns = data.columns;
        this.dataObjects.data = data.data;
        this.isLoading = false
      },
    })
  }

  onViewEmployee(employeeId: number): void {
    this.router.navigateByUrl('/profile/' + employeeId);
    this.cookieService.set(this.PREVIOUS_PAGE, '/data-reports/' + this.dataReportCode);
  }

  getProperty(obj: any, key: string): any {
    return obj[key];
  }

  UpdateCustomInput(index: number, column: DataReportColumns, e: any) {
    var reportId = this.dataObjects.reportId
    var columnId = column.id;
    var employeeId = this.dataObjects.data![index].Id;
    var checkBoxChecked = e.srcElement.checked;
    var input = e.srcElement.value;

    if (checkBoxChecked == true) {
      input = "true";
    }
    if (checkBoxChecked == false) {
      input = "false"
    }

    this.dataObjects.data![index][column.prop] = input;

    var reportInput = {
      reportId: reportId,
      columnId: columnId,
      employeeId: employeeId,
      input: input
    }

    this.updateReportData(reportInput).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Report Updated", "snack-success")
      },
      error: error => {
        this.snackBarService.showSnackbar("Report Update Failed", "snack-error")
      }
    })
  }

  addColumn(prop?: string) {
    console.log(prop);
  }
}