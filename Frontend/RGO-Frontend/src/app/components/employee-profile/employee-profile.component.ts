import { Component } from '@angular/core';
import { AccessPropertiesService } from 'src/app/services/access-properties.service';
import { Properties } from 'src/app/models/properties.interface';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  EmployeeFields: Properties[] = [];
  EditFields: Properties[] = [];

  isEdit: boolean = false;

  constructor(private accessPropertyService: AccessPropertiesService, private cookieService : CookieService) { }
  ngOnInit() {
    this.getEmployeeFields();
  }
  
  getEmployeeFields(){
    this.accessPropertyService.GetAccessProperties(this.cookieService.get('userEmail')).subscribe(
      data => {
        this.EmployeeFields = data;
      }
    );
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
    this.EditFields = JSON.parse(JSON.stringify(this.EmployeeFields));
  }

  canEdit(field: Properties): boolean{
    return this.isEdit && field.condition == 2;
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
    this.accessPropertyService.UpdateProperties(this.cookieService.get('userEmail'), payload).subscribe(() => {
    });
    setTimeout(()=>{
      this.getEmployeeFields();
    },500)
    this.toggleEdit();
  }
}