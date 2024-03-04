import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFieldCodeComponent } from './manage-field-code.component';

describe('ManageFieldCodeComponent', () => {
  let component: ManageFieldCodeComponent;
  let fixture: ComponentFixture<ManageFieldCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageFieldCodeComponent]
    });
    fixture = TestBed.createComponent(ManageFieldCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});