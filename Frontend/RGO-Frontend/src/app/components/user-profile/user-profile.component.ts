import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {
type$: Observable<Token>=this.store.select('app')

constructor(private store: Store<{app:Token}>){}

ngOnInit()
{

}
}
 
