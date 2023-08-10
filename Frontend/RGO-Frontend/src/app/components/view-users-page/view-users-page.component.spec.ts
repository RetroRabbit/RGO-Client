import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersPageComponent } from './view-users-page.component';

describe('ViewUsersPageComponent', () => {
  let component: ViewUsersPageComponent;
  let fixture: ComponentFixture<ViewUsersPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsersPageComponent]
    });
    fixture = TestBed.createComponent(ViewUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
