import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Workshop } from 'src/app/models/Workshop.interface';
import { getSelectedWorkshop, getAllWorkshops, getTodaysWorkshop } from 'src/app/store/actions/workshop.actions';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';

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

  constructor(private store: Store<{ workshop: WorkshopState }>) { }

  ngOnInit(): void {
    this.store.dispatch(getAllWorkshops());
    setTimeout(() => {
      this.store.dispatch(getTodaysWorkshop());
    }, 500);

    this.workshop$.subscribe((state) => {
      this.allWorkshops = state.AllWorkshops;
      this.todaysWorkshop = state.TodaysWorkshops;
    });
  }

  getTodaysWorkshop(index: number, todayArray: Workshop[]) {
    this.store.dispatch(getSelectedWorkshop({ index: index, workshops: todayArray }));
    this.store.select("workshop").subscribe(state => {
      this.selectedWorkshop = state.selectedWorkshop;
    });
  }

  showPastWorkshops(): Workshop[] {
    const currentDate = new Date().getTime();
  
    if (!this.allWorkshops || this.allWorkshops.length === 0) {
      return [];
    }
  
    return this.allWorkshops.filter((workshop) => {
      const workshopEndDate = new Date(workshop.eventId.endDate).getTime();
      return workshopEndDate < currentDate;
    });
  }
  
}


