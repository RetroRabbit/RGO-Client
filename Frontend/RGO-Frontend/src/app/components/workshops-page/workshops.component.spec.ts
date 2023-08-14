import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopsComponent } from './workshops.component';

describe('WorkshopsPageComponent', () => {
  let component: WorkshopsComponent;
  let fixture: ComponentFixture<WorkshopsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopsComponent]
    });
    fixture = TestBed.createComponent(WorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
