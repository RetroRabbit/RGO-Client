import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCustomFieldComponent } from './save-custom-field.component';

describe('UpdateFieldComponent', () => {
  let component: SaveCustomFieldComponent;
  let fixture: ComponentFixture<SaveCustomFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveCustomFieldComponent]
    });
    fixture = TestBed.createComponent(SaveCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
