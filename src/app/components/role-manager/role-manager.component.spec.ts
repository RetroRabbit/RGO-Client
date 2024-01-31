import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagerComponent } from './role-manager.component';

describe('RoleManagerComponent', () => {
  let component: RoleManagerComponent;
  let fixture: ComponentFixture<RoleManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleManagerComponent]
    });
    fixture = TestBed.createComponent(RoleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
