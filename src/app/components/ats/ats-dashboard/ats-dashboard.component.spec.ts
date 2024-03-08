import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsDashboardComponent } from './ats-dashboard.component';

describe('AtsDashboardComponent', () => {
  let component: AtsDashboardComponent;
  let fixture: ComponentFixture<AtsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsDashboardComponent]
    });
    fixture = TestBed.createComponent(AtsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
