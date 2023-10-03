import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFieldCodeComponent } from './new-field-code.component';

describe('NewFieldCodeComponent', () => {
  let component: NewFieldCodeComponent;
  let fixture: ComponentFixture<NewFieldCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewFieldCodeComponent]
    });
    fixture = TestBed.createComponent(NewFieldCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
