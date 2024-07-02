import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DataReport } from 'src/app/models/hris/data-report.interface';
import { NavItem } from 'src/app/models/hris/report-menu-item.interface';
import { DataReportingService } from 'src/app/services/hris/data-reporting.service';
import { ReportColumnRequest } from 'src/app/models/hris/report-column-request.interface';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DataReportDetailComponent } from '../details/data-report-detail.component';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[] = [];
  @Input() dataReport: DataReport = {};
  @ViewChild('childMenu') public childMenu!: MatMenu;
  
  @ViewChild('dialogTemplate', { static: true })
  dialogTemplate!: TemplateRef<any>;
  requestData: ReportColumnRequest = {
    id: 0,
    reportId: 0,
    menuId: 0,
    sequence: 0,
    name: ''
  };
  nameInput?: string;

  constructor(public router: Router,
  private dataReportingService: DataReportingService, 
  private snackBarService: SnackbarService, 
  private dialog: MatDialog,
  private dataReportDetailComponent: DataReportDetailComponent) {
  }

  ngOnInit() {
  }

  addColumn(child: NavItem) {
    this.requestData = {
      id: 0,
      menuId: child.id,
      reportId: this.dataReport.reportId!,
      customType: child.prop,
      name: child.name,
      sequence: 0,
    };

    if(this.requestData.customType == "Text" || this.requestData.customType == "CheckBox"){
      this.showAddReportModal(this.requestData)
      return
    }

    this.dataReportingService.addColumnToReport(this.requestData).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Column Added", "snack-success")
        this.dialog.closeAll();
        this.dataReportDetailComponent.populateReportData(this.dataReportDetailComponent.dataReportCode);
      },
      error: error =>{
        this.snackBarService.showSnackbar("Column Adding failed", "snack-error")
      }
    })
  }

  addCustomColumn(requestData: ReportColumnRequest){
    requestData = {
      id: 0,
      menuId: requestData.id,
      reportId: requestData.reportId,
      customType: requestData.customType,
      name: this.nameInput!,
      sequence: 0,
    };

    this.dataReportingService.addColumnToReport(requestData).subscribe({
      next: data => {
        this.snackBarService.showSnackbar("Column Added", "snack-success")
        this.dialog.closeAll();
        this.dataReportDetailComponent.populateReportData(this.dataReportDetailComponent.dataReportCode);
      },
      error: error =>{
        this.snackBarService.showSnackbar("Column Adding failed", "snack-error")
      }
    })
  }

  showAddReportModal(request: ReportColumnRequest){
    this.requestData = request;
    this.dialog.open(this.dialogTemplate, {
      width: '500px'
    });
  }
}