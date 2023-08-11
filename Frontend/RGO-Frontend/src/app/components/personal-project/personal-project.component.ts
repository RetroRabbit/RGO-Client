import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable, debounceTime, take } from 'rxjs';
import { Token } from 'src/app/models/token.interface';
import { Userstacks } from 'src/app/models/userstacks.interface';
import { UserstacksService } from 'src/app/services/userstacks.service';
import { GetUserstacks, SetUserstack } from 'src/app/store/actions/userstacks.action';
import { UserstackState } from 'src/app/store/reducers/userstacks.reducer';

@Component({
  selector: 'app-personal-project',
  templateUrl: './personal-project.component.html',
  styleUrls: ['./personal-project.component.css']
})
export class PersonalProjectComponent{
  userStacks$  = this.userstackStore.select('userstack');
 
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();
  
constructor(private userstackStore: Store<{ userstack: UserstackState}>, public service: UserstacksService){}

ngOnInit(): void {
    this.userstackStore.dispatch(GetUserstacks())
}


onSetUserstackClick(){
  this.userstackStore.dispatch(SetUserstack());
  this.service.CaptureEvent('stack', this.selectedItem)
}

}
