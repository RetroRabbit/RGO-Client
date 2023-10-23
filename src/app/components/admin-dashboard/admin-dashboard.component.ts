import { Component,ElementRef, ViewChild, inject } from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {NgFor, AsyncPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NgToastService } from 'ng-angular-popup';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent {

  categoryControl = new FormControl();

  // chart data variabbals
  chartName: string = 'Name';
  selectedDataItems: string[] = [];
  chartType: any = 'bar';
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartOptions: any = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
  categories: string[] = [];// ToDo: fetch from backend
  filteredCategories: string[] = this.categories;
  categoryCtrl = new FormControl();
  selectedCategories: string[] = [];


  // roles variabbals
  roleControl = new FormControl();
  roles: string[] = [];
  filteredRoles: string[] = this.roles;
  roleCtrl = new FormControl();
  selectedRoles: string[] = [];

  @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
  charts: Chart[] = [];
  public showModal: boolean = false;

readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  profileImage: string | null = null;


  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };

  constructor(
    private chartService: ChartService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private toast: NgToastService,
    private employeeRoleService: EmployeeRoleService
  ) {
    this.categoryCtrl.valueChanges.subscribe(val => {
      if (val) {
        this.filteredCategories = this.filterCategories(val);
      } else {
        this.filteredCategories = this.categories;
      }
    });
  }

  ngOnInit() {
    // Getting the charts
    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
    });

    // Setting the categoryControl value changes
    this.categoryControl.valueChanges.subscribe(val => {
      this.selectedCategories = val;
    });

    this.roleControl.valueChanges.subscribe(val => {
      this.selectedRoles = val;
    });

    // Fetching the chart data
    this.getChartData();

    // Assuming the method getCategoriesColumns() fetches the required data
    this.chartService.getColumns().subscribe({
      next: data => {
        this.categories = data;
        this.filteredCategories = data;
      }
    });

    this.employeeRoleService.getAllRoles().subscribe({
      next: data => {
        this.roles = data;
        this.filteredRoles = data;
      }
    });
  }

  CaptureEventOld(event: any) {
    // const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', "+ Add Graph");
  }

  CaptureEvent(event: any) {
    let dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '500px',
      // you can add more configuration options here if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // Handle any actions after the dialog is closed
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.viewValue);
    this.categoryCtrl.setValue(null);
  }

  filterCategories(val: string): string[] {
    return this.categories.filter(category =>
      category.toLowerCase().includes(val.toLowerCase()));
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  toggleSelection(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.categoryControl.setValue(null);
  }

  onCategoryRemoved(category: string): void {
    const categories = this.categoryControl.value;
    const index = categories.indexOf(category);
    if (index >= 0) {
      categories.splice(index, 1);
      this.categoryControl.setValue(categories);
    }
  }

  // For Roles:
roleCtrlValueChanges() {
  this.roleCtrl.valueChanges.subscribe(val => {
    if (val) {
      this.filteredRoles = this.filterRoles(val);
    } else {
      this.filteredRoles = this.roles;
    }
  });
}

filterRoles(val: string): string[] {
  return this.roles.filter(role =>
    role.toLowerCase().includes(val.toLowerCase()));
}

onRoleRemoved(role: string): void {
  const roles = this.roleControl.value;
  const index = roles.indexOf(role);
  if (index >= 0) {
    roles.splice(index, 1);
    this.roleControl.setValue(roles);
  }
}

//Chart logic
  createChart() {
    this.chartService.createChart(this.selectedDataItems, this.chartName, this.chartType)
      .subscribe({
        next : response => {
          this.toast.success({detail:"Success",summary:'Chart created',duration:5000, position:'topRight'});
          this.cookieService.set('currentPage', "Charts");
        },
        error: error => {
            this.toast.error({detail:"Error", summary:"Failed to create chart.",duration:5000, position:'topRight'});
        }}
      );
  }

  getChartData() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      this.chartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: error => {
          this.toast.error({
            detail: "Error",
            summary: "Failed to get chartData.",
            duration: 5000,
            position: 'topRight'
          });
        }
    });
    } else {
      this.toast.info({
        detail: "No data selected.",
        summary: "Please select data items.",
        duration: 5000,
        position: 'topRight'
      });
    }
  }

  onDropDownChange() {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      console.log ("dropdown changed")
      this.chartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: error => {
          this.toast.error({
            detail: "Error",
            summary: "Failed to get chartData.",
            duration: 5000,
            position: 'topRight'
          });
        }
    });
    } else {
      this.toast.info({
        detail: "No data selected.",
        summary: "Please select data items.",
        duration: 5000,
        position: 'topRight'
      });
    }
  }

  CaptureEventlast(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
