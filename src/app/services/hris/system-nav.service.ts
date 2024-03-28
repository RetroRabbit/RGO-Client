import { Injectable } from '@angular/core';
import { CustomField } from '../../models/hris/custom-field.interface';

@Injectable({
  providedIn: 'root'
})
export class SystemNav {

  public selectedMenuItem: string = '';
  public selectedField?: CustomField;
}