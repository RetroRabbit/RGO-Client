import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeeComponent } from './new-employee.component';

describe('NewEmployeeComponent', () => {
  let component: NewEmployeeComponent;
  let fixture: ComponentFixture<NewEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEmployeeComponent]
    });
    fixture = TestBed.createComponent(NewEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
