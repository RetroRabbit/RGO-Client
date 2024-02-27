import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsProfileComponent } from './ats-profile.component';

describe('AtsProfileComponent', () => {
  let component: AtsProfileComponent;
  let fixture: ComponentFixture<AtsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsProfileComponent]
    });
    fixture = TestBed.createComponent(AtsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
