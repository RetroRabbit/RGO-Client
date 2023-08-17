import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Workshop } from 'src/app/models/Workshop.interface';
import { getSelectedWorkshop, getAllWorkshops, getTodaysWorkshop } from 'src/app/store/actions/workshop.actions';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { WorkshopService } from 'src/app/services/workshop.service';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.css']
})
export class WorkshopsComponent implements OnInit {
  allWorkshops: Workshop[] = [];
  pastWorkshops : Workshop[] = [];
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

  constructor(private store : Store<{workshop : WorkshopState}>,public service: WorkshopService,private home: HomeComponent){}

  ngOnInit(): void {
    this.store.dispatch(getAllWorkshops());
    setTimeout(() => {
      this.store.dispatch(getTodaysWorkshop());
      this.workshop$.subscribe((state) => {
        this.allWorkshops = state.AllWorkshops;
      });
      this.GetPastWorkshops();
    }, 500);
  }

  getSelectedWorkshop(index: number, todayArray: Workshop[]) {
    this.store.dispatch(getSelectedWorkshop({ index: index, workshops: todayArray }));
    this.service.CaptureEvent('Viewable Workshop');
    this.home.handleSelectedItem();
    
  }

  GetPastWorkshops(){
    const currentDate = new Date().getTime();
    this.pastWorkshops = this.allWorkshops.filter((workshop) => {
      const workshopEndDate = new Date(workshop.eventId.startDate).getTime();
      return workshopEndDate < currentDate;
    });
  }
}


