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
export class WorkshopsPageComponent implements OnInit {
  allWorkshops: Workshop[] = [];
  todaysWorkshop: Workshop[] = [];
  selectedWorkshop: Workshop = {
    id: 0,
    eventId: {
      id: -1,
      groupid: -1,
      title: "",
      description: "",
      userType: -1,
      startDate: new Date,
      endDate: new Date,
      eventType: -1
    },
    presenter: "",
    viewable: true
  };


  workshop$ = this.store.select("workshop");

  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private store : Store<{workshop : WorkshopState}>,public service: WorkshopService){}

  ngOnInit(): void {
    this.store.dispatch(getAllWorkshops());
    setTimeout( ()=>{
      this.store.dispatch(getTodaysWorkshop());
    }, 500)
  }

  CaptureArrays(state : any){
    
    this.todaysWorkshop = state.TodaysWorkshops;
    console.log(state.TodaysWorkshops);
  }

  GetTodaysWorkshop(index: number, todayArray: Workshop[]) {
    this.store.dispatch(getSelectedWorkshop({ index: index, workshops: todayArray }));
    this.service.CaptureEvent('Viewable Workshop', this.selectedItem);
  }
}
