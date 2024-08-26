import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSpinnerComponent } from './global-spinner.component';

describe('GlobalSpinnerComponent', () => {
  let component: GlobalSpinnerComponent;
  let fixture: ComponentFixture<GlobalSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSpinnerComponent]
    });
    fixture = TestBed.createComponent(GlobalSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
