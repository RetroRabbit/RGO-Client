import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersComponent } from './view-users.component';

describe('ViewUsersPageComponent', () => {
  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsersComponent]
    });
    fixture = TestBed.createComponent(ViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
