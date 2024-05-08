import { Injectable } from '@angular/core';
import { CustomField } from '../../models/hris/custom-field.interface';

@Injectable({
  providedIn: 'root'
})
export class SystemNav {

  public selectedMenuItem: string = '';
  public selectedField?: CustomField;
  public selectedEmployeeMenuItem: string = '';
  private selectedTabIndex: number = 0;
  public isEditing: boolean = false;

  public setSelectedTabIndex(index: number): void{
    this.selectedTabIndex = index;
  }

  public getSelectedTabIndex(): number {
    return this.selectedTabIndex;
  }

  public setIsEditing(isEditing: boolean) {
    this.isEditing = isEditing;
  }
}