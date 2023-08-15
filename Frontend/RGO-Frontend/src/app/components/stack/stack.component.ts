import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Userstacks } from 'src/app/models/userstacks.interface';
import { GetUserstacks, SetUserstack, UpdateUserstack } from 'src/app/store/actions/userstacks.action';
import { UserstackState } from 'src/app/store/reducers/userstacks.reducer';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent {
  userStacks$  = this.userstackStore.select('userstack');
  userStacks?: Userstacks | null;
  descriptionEdit: string ='';

  constructor(private userstackStore: Store<{ userstack: UserstackState}> ){}
  
  ngOnInit(): void {
    this.userstackStore.dispatch(GetUserstacks());
    this.userStacks$.subscribe((state) =>{
      this.userStacks = state.userstacks
      if (this.userStacks) {
        this.descriptionEdit = this.userStacks.description;
      }
    });
  }

  updateDescription() {
    if (this.userStacks) {
      this.userStacks = {
        ...this.userStacks,
        description: this.descriptionEdit
      };
      this.userstackStore.dispatch(UpdateUserstack({ userstacks: this.userStacks }));
    }
  }
}
