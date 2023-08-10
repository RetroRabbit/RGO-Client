import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewableWorkshopPageComponent } from './viewable-workshop-page.component';

describe('ViewableWorkshopPageComponent', () => {
  let component: ViewableWorkshopPageComponent;
  let fixture: ComponentFixture<ViewableWorkshopPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewableWorkshopPageComponent]
    });
    fixture = TestBed.createComponent(ViewableWorkshopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
