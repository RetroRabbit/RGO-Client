import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-viewable-workshop-page',
  templateUrl: './viewable-workshop-page.component.html',
  styleUrls: ['./viewable-workshop-page.component.css']
})
export class ViewableWorkshopPageComponent implements OnInit{
  
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  
  constructor(private store: Store<{workshop : WorkshopState}>, public service: WorkshopService){}

  ngOnInit(){
    this.store.select('workshop');
  }


}
