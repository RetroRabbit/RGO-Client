import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Workshop } from 'src/app/models/Workshop.interface';
import { getSelectedWorkshop, getAllWorkshops, getTodaysWorkshop } from 'src/app/store/actions/workshop.actions';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { Token } from '../../models/token.interface';
import { WorkshopService } from 'src/app/services/workshop.service';
@Component({
  selector: 'app-workshops-page',
  templateUrl: './workshops-page.component.html',
  styleUrls: ['./workshops-page.component.css']
})
export class WorkshopsPageComponent implements OnInit{

  allWorkshops : Workshop[] = [];
  selectedWorkshop !: Workshop;

  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private store : Store<{workshop : WorkshopState}>,public service: WorkshopService){

  }

  ngOnInit(): void{
    
    this.store.dispatch(getAllWorkshops());
    this.store.select('workshop').subscribe(state => {
      this.allWorkshops = state.AllWorkshops;
    })
  }

  
}
