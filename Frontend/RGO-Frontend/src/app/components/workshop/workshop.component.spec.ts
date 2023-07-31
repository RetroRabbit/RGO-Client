import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopComponent } from './workshop.component';

describe('WorkshopComponent', () => {
  let component: WorkshopComponent;
  let fixture: ComponentFixture<WorkshopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopComponent]
    });
    fixture = TestBed.createComponent(WorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
