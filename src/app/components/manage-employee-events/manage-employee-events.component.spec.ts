import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeEventsComponent } from './manage-employee-events.component';

describe('ManageEmployeeEventsComponent', () => {
  let component: ManageEmployeeEventsComponent;
  let fixture: ComponentFixture<ManageEmployeeEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeEventsComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
