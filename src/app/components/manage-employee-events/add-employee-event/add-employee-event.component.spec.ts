import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeEventComponent } from './add-employee-event.component';

describe('AddEmployeeEventComponent', () => {
  let component: AddEmployeeEventComponent;
  let fixture: ComponentFixture<AddEmployeeEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeEventComponent]
    });
    fixture = TestBed.createComponent(AddEmployeeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
