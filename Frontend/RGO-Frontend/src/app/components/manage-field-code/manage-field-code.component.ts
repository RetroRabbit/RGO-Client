import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { dataTypes } from 'src/app/models/constants/types.constants';
import { statuses } from 'src/app/models/constants/statuses.constants';
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
      console.error('Error fetching field codes:', error);
    }
  });
}

onTypeChange(){
  this.isClicked = true;
  this.selectedFieldCode = this.selectedFieldCode;
}

}
