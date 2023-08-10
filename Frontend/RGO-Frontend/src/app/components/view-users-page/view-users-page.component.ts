import { Component } from '@angular/core';

@Component({
  selector: 'app-view-users-page',
  templateUrl: './view-users-page.component.html',
  styleUrls: ['./view-users-page.component.css']
})
export class ViewUsersPageComponent implements OnInit {
  
  constructor(private store : Store<{workshop : WorkshopState}>){}

  ngOnInit(): void {
    
  }

}
