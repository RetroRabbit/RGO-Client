import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeComponent } from './view-employee.component';

describe('ViewEmployeeComponent', () => {
  let component: ViewEmployeeComponent;
  let fixture: ComponentFixture<ViewEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEmployeeComponent]
    });
    fixture = TestBed.createComponent(ViewEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
