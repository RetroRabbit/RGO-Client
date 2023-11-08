import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsComponent } from './system-settings.component';

describe('SystemSettingsComponent', () => {
  let component: SystemSettingsComponent;
  let fixture: ComponentFixture<SystemSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemSettingsComponent]
    });
    fixture = TestBed.createComponent(SystemSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
