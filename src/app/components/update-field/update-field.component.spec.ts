import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFieldComponent } from './update-field.component';

describe('UpdateFieldComponent', () => {
  let component: UpdateFieldComponent;
  let fixture: ComponentFixture<UpdateFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFieldComponent]
    });
    fixture = TestBed.createComponent(UpdateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
