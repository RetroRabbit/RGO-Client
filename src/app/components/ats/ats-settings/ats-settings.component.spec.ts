import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsSettingsComponent } from './ats-settings.component';

describe('AtsSettingsComponent', () => {
  let component: AtsSettingsComponent;
  let fixture: ComponentFixture<AtsSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsSettingsComponent]
    });
    fixture = TestBed.createComponent(AtsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
