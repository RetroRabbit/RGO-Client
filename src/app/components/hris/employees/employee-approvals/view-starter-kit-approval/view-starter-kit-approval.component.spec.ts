import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEmployeeStarterkitsComponent } from './view-starter-kit-approval.component';

describe('PendingEmployeeStarterkitsComponent', () => {
  let component: PendingEmployeeStarterkitsComponent;
  let fixture: ComponentFixture<PendingEmployeeStarterkitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingEmployeeStarterkitsComponent]
    });
    fixture = TestBed.createComponent(PendingEmployeeStarterkitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
