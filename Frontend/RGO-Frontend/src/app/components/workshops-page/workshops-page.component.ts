import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Workshop } from 'src/app/models/Workshop.interface';
import { getSelectedWorkshop, getAllWorkshops, getTodaysWorkshop } from 'src/app/store/actions/workshop.actions';
import { WorkshopState } from 'src/app/store/reducers/workshop.reducer';
import { WorkshopService } from 'src/app/services/workshop.service';
@Component({
  selector: 'app-workshops-page',
  templateUrl: './workshops-page.component.html',
  styleUrls: ['./workshops-page.component.css']
})
export class WorkshopsPageComponent implements OnInit {
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

  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private store : Store<{workshop : WorkshopState}>,public service: WorkshopService){}

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

  getTodaysWorkshop(index: number, todayArray: Workshop[]) {
    this.store.dispatch(getSelectedWorkshop({ index: index, workshops: todayArray }));
    this.service.CaptureEvent('Viewable Workshop', this.selectedItem);
  }

  // showPastWorkshops(): Workshop[] {
  //   const currentDate = new Date().getTime();
  
  //   if (!this.allWorkshops || this.allWorkshops.length === 0) {
  //     return [];
  //   }
  
  //   return this.allWorkshops.filter((workshop) => {
  //     const workshopEndDate = new Date(workshop.eventId.endDate).getTime();
  //     return workshopEndDate < currentDate;
  //   });
  // }
  GetPastWorkshops(){
    const currentDate = new Date().getTime();
    console.log(this.allWorkshops)
    this.pastWorkshops = this.allWorkshops.filter((workshop) => {
      const workshopEndDate = new Date(workshop.eventId.startDate).getTime();
      return workshopEndDate < currentDate;
    });
    console.log(this.pastWorkshops)
  }
}


