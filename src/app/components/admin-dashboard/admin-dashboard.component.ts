import { Component,ElementRef, ViewChild, inject } from '@angular/core';
import { Chart } from 'src/app/models/charts.interface';
import { ChartService } from 'src/app/services/charts.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { EmployeeTypeService } from 'src/app/services/employee/employee-type.service';
import { EmployeeType } from 'src/app/models/employee-type.model';



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})

export class AdminDashboardComponent {

  categoryControl = new FormControl();

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

  ngOnInit() {
    const types: string = this.cookieService.get('userType');
    this.roles = Object.keys(JSON.parse(types));

    this.chartService.getAllCharts().subscribe({
      next: (data) => (this.charts = data),
      error: (error) =>{
        this.toast.error({detail:"Error", summary:"Failed to fetch charts.",duration:5000, position:'topRight'});
      }
    });

    this.categoryControl.valueChanges.subscribe(val => {
      this.selectedCategories = val;
    });

    this.typeControl.valueChanges.subscribe(val => {
      this.selectedTypes = val;
    });

    this.chartService.getColumns().subscribe({
      next: data => {
        this.categories = data;
        this.filteredCategories = data;
      }
    });

    this.employeeTypeService.getAllEmployeeTypes().subscribe({
      next: (data: EmployeeType[]) => {
        this.types = data.map(type => type.name || '');
        this.filteredTypes = this.types;
      }
    });
  }

  isAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  CaptureEventOld(event: any) {
    this.cookieService.set('currentPage', "+ Add Graph");
  }

  CaptureEvent(event: any) {
    let dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '500px'
    });
  }

  AddNewHire(event : any){
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
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

  createChart() {
    if(!this.chartType){
      this.toast.info({detail:"Missing chart type", summary:"Please select a chart type",duration:5000, position:'topRight'});
      return;
    }
    if(!this.chartName){
      this.toast.info({detail:"Missing chart name", summary:"Please enter a chart name",duration:5000, position:'topRight'});
      return;
    }
    if(this.selectedCategories.length  < 1){
      this.toast.info({detail:"Missing chart category", summary:"Please select a category/s",duration:5000, position:'topRight'});
      return;
    }

    this.chartService.createChart(this.selectedCategories, this.chartName, this.chartType)
      .subscribe({
        next : response => {
          this.toast.success({detail:"Success",summary:'Chart created',duration:5000, position:'topRight'});
          this.dialog.closeAll();
          this.selectedCategories = [];
          this.chartName = '';
          this.chartType = '';
          this.ngOnInit();
        },
        error: error => {
            this.toast.error({detail:"Error", summary:"Failed to create chart.",duration:5000, position:'topRight'});
        }}
      );
  }

  onDropDownChange() {
      if(this.selectedDataItems.length < 1){
        return;
      }
      this.chartService.getChartDataByType(this.selectedDataItems).subscribe({
        next: data => {
          this.chartData = data.data;
          this.chartLabels = data.labels;
        },
        error: error => {
          this.toast.error({ detail: "Error", summary: "Failed to get chartData.", duration: 5000,position: 'topRight'});
        }
    });
  }

  CaptureEventlast(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }

  recieveNumber(number:any){
    this.chartService.getAllCharts().subscribe({
      next : data => this.charts = data,
      error: error => this.toast.error({ detail: "Error", summary: "Failed to get charts.", duration: 5000,position: 'topRight'})
    })
  }
}
