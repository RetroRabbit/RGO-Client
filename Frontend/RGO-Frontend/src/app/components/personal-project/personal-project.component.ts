import { Component, OnInit } from '@angular/core';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Token } from 'src/app/models/token.interface';
import { Userstacks } from 'src/app/models/userstacks.interface';
import { GetUserstacks } from 'src/app/store/actions/userstacks.action';
import { UserstackState } from 'src/app/store/reducers/userstacks.reducer';

@Component({
  selector: 'app-personal-project',
  templateUrl: './personal-project.component.html',
  styleUrls: ['./personal-project.component.css']
})
export class PersonalProjectComponent implements OnInit {
  userStacks: Userstacks | null | undefined;

constructor(private userstackStore: Store<{ userstack: UserstackState}>) {
}

ngOnInit(): void {
  this.userstackStore.dispatch(GetUserstacks());
  this.userstackStore.select('userstack').subscribe(state => {
    this.StoreUserstacks(state.userstacks)
    this.userStacks = state.userstacks
  })
}

StoreUserstacks(userstacks: Userstacks| null){
}
}
