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
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeType } from 'src/app/models/employee-type.model';



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent {

  categoryControl = new FormControl();

  // chart data variabbals
  chartName: string = '';
  selectedDataItems: string[] = [];
  chartType: any = '';
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

  // type variables
  typeControl = new FormControl();
  types: string[]= [];
  filteredTypes: any[] = this.types;
  selectedTypes: string[] = [];

  @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
  charts: Chart[] = [];
  public showModal: boolean = false;

readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedItem: string = 'Dashboard';
  menuClicked: boolean = false;
  profileImage: string | null = null;
  roles : string[] = [];


  employeeType: { id: number; name: string } = {
    id: 0,
    name: '',
  };

  constructor(
    private chartService: ChartService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private toast: NgToastService,
    private employeeTypeService: EmployeeTypeService,
  ) {
    this.categoryCtrl.valueChanges.subscribe(val => {
      if (val) {
        this.filteredCategories = this.filterCategories(val);
      } else {
        this.filteredCategories = this.categories;
      }
    });
  }


  // ngOnInit() {
  //   const types: string = this.cookieService.get('userType');
  //   this.roles = Object.keys(JSON.parse(types));

  //   this.chartService.getAllCharts().subscribe({
  //     next: (data) => (this.charts = data),
  //   });
  // }



  ngOnInit() {

    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

    // Getting the charts
    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
    });

    // Setting the categoryControl value changes
    this.categoryControl.valueChanges.subscribe(val => {
      this.selectedCategories = val;
    });

    this.typeControl.valueChanges.subscribe(val => {
      this.selectedTypes = val;
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

    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        // Assuming data is an array of EmployeeType objects
        this.types = data.map(type => type.name || ''); // Extract the 'name' property
        this.filteredTypes = this.types; // Assign the same array to filteredTypes
      }
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
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

  // For Types:
TypeCtrlValueChanges() {
  this.typeControl.valueChanges.subscribe(val => {
    if (val) {
      this.filteredTypes = this.filterTypes(val);
    } else {
      this.filteredTypes = this.types;
    }
  });
}

filterTypes(val: string): string[] {
  return this.types.filter(types =>
    types.toLowerCase().includes(val.toLowerCase()));
}

onTypeRemoved(type: string): void {
  const types = this.typeControl.value;
  const index = types.indexOf(type);
  if (index >= 0) {
    types.splice(index, 1);
    this.typeControl.setValue(types);
  }
}

//Chart logic
  createChart() {
    this.chartService.createChart(this.selectedCategories, this.chartName, this.chartType)
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
