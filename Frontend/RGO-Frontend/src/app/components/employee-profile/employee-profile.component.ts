import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  EmployeeFields: Properties[] = [];
  EditFields: Properties[] = [];

  isEdit: boolean = false;

  constructor(private accessPropertyService: AccessPropertiesService) { }
  ngOnInit() {
    this.getEmployeeFields();
  }
  
  getEmployeeFields(){
    this.accessPropertyService.GetAccessProperties('mschoeman@retrorabbit.co.za').subscribe(
      data => {
        this.EmployeeFields = data;
      }
    );
  }
  toggleEdit() {
    this.isEdit = !this.isEdit;
    this.EditFields = JSON.parse(JSON.stringify(this.EmployeeFields));
  }
  captureChange(htmlValue: any, index: number) {
    this.EditFields[index].value = htmlValue.target.value;
  }
  
  saveChanges(){
    let payload : any[] = [];

    this.EditFields.forEach((field, index) =>{
      if(field.value !== this.EmployeeFields[index].value){
        payload.push({
          fieldId: field.id,
          value: field.value
        })
      }
    });
    this.accessPropertyService.UpdateProperties('mschoeman@retrorabbit.co.za', payload).subscribe(() => {
      this.toggleEdit();
      this.getEmployeeFields();
    });
  }
}