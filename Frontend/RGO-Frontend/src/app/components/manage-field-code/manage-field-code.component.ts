import { Component } from '@angular/core';
import { FieldCodeService } from 'src/app/services/field-code.service';
import { Router } from '@angular/router';
import { FieldCode } from 'src/app/models/field-code.interface';

@Component({
  selector: 'app-manage-field-code',
  templateUrl: './manage-field-code.component.html',
  styleUrls: ['./manage-field-code.component.css']
})
export class ManageFieldCodeComponent {

  fieldCodes?: FieldCode[];
  selectedFieldCode?: FieldCode;
  isClicked: boolean = false;
 
constructor(public router: Router, private fieldCodeService: FieldCodeService){}

ngOnInit(): void {
  this.fieldCodeService.getAllFieldCodes().subscribe({
    next: fieldCodes => {
      this.fieldCodes = fieldCodes;
    },
    error: error => {
    }
  });
}

onTypeChange(){
  this.isClicked = true;
  this.selectedFieldCode = this.selectedFieldCode;
}

}
