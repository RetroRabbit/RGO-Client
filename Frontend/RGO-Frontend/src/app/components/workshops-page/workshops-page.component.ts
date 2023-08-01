import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Workshop } from 'src/app/models/Workshop.interface';
import { getSelectedWorkshop, getAllWorkshops, getTodaysWorkshop } from 'src/app/store/actions/workshop.actions';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { Token } from '../../models/token.interface';
@Component({
  selector: 'app-workshops-page',
  templateUrl: './workshops-page.component.html',
  styleUrls: ['./workshops-page.component.css']
})
export class WorkshopsPageComponent implements OnInit{

  allWorkshops : Workshop[] = [];

  constructor(private store : Store<{workshop : WorkshopState}>, private appStore : Store<{app : Token}>){

  }

  ngOnInit(): void{
    this.appStore.select('app').subscribe( state => {
      this.appStore.dispatch(getAllWorkshops({token: state.token}));
    })
    this.store.select('workshop').subscribe(state => {
      this.allWorkshops = state.AllWorkshops;
      console.log(state.AllWorkshops);
    })
  }
}
