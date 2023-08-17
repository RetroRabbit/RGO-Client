import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { WorkshopService } from 'src/app/services/workshop.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-viewable-workshop-page',
  templateUrl: './viewable-workshop-page.component.html',
  styleUrls: ['./viewable-workshop-page.component.css']
})
export class ViewableWorkshopPageComponent implements OnInit{

  selectedWorkshop$ = this.store.select("workshop");
  
  constructor(private store: Store<{workshop : WorkshopState}>, public service: WorkshopService,private home: HomeComponent){}

  ngOnInit(){ 
  }

  backToWorkshop(){
    this.service.CaptureEvent('Workshops')
    this.home.handleSelectedItem();
  }


}
