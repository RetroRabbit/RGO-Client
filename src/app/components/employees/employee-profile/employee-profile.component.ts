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
  
  name : string = "";
  surname : string = "";
  pc : string = "";

  constructor(private accessPropertyService: AccessPropertiesService, 
    private cookieService : CookieService) { }

  ngOnInit() {
    this.getEmployeeFields();
  }

  getEmployeeFields(){
    this.accessPropertyService.GetAccessProperties(this.cookieService.get('userEmail')).subscribe({
      next: data => {
        this.EmployeeFields = data;
        console.log(this.EmployeeFields)
        this.name = this.getValue("Employee Name");
        this.surname = this.getValue("Surname");
        this.pc = this.getValue("People's Champion");
        console.log(this.pc)
      }
  });
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
    this.accessPropertyService.UpdateProperties(this.cookieService.get('userEmail'), payload).subscribe(
      () => {
    });
    setTimeout(()=>{
      this.getEmployeeFields();
    },500)
    this.toggleEdit();
  }

    getValue(label : any) : any{
      let field = this.EmployeeFields.filter( field => field.label === label);
      // console.table(field);
      return field[0].value != null ? field[0].value : "-";
    }
}
