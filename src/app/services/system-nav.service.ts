import { Injectable } from '@angular/core';
import { FieldCode } from '../models/hris/field-code.interface';

@Injectable({
  providedIn: 'root'
})
export class SystemNav {

  public selectedMenuItem: string = '';
  public selectedField!: FieldCode;
}