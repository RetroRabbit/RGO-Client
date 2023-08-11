import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetUserstacks, SetUserstack } from 'src/app/store/actions/userstacks.action';
import { UserstackState } from 'src/app/store/reducers/userstacks.reducer';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent {
  userStacks$  = this.userstackStore.select('userstack');
  constructor(private userstackStore: Store<{ userstack: UserstackState}> ){}
  ngOnInit(): void {
    this.userstackStore.dispatch(GetUserstacks());
  }
}
