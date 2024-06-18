import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DataReportList } from 'src/app/models/hris/data-report-list';

@Component({
    selector: 'app-data-reports',
    templateUrl: './data-reports.component.html',
    styleUrls: ['./data-reports.component.css']
})
export class DataReportsComponent {
    baseUrl: string;
    constructor(private router: Router, private httpClient: HttpClient) {
      this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
    }

    dataObjects: DataReportList[] = [
    ];

    screenWidth = window.innerWidth;

    @HostListener('window:resize', ['$event'])
    
    onResize() {
      this.screenWidth = window.innerWidth;
    }

    ngOnInit() {
      this.onResize();
      this.populateDataReportList();
    }

    onViewReport(code: string): void {
      this.router.navigateByUrl('/data-reports/' + code);
    }

    fetchDataReportList(): Observable<DataReportList[]>{
      return this.httpClient.get<DataReportList[]>(`${this.baseUrl}/get-data-report-list`);
    }

    populateDataReportList(){
      this.fetchDataReportList().subscribe({
        next: data => {
          this.dataObjects = data;
        }
      })
    }
}