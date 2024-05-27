import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionCareerWorkExperienceComponent } from './accordion-career-work-experience.component';

describe('AccordionCareerWorkExperienceComponent', () => {
  let component: AccordionCareerWorkExperienceComponent;
  let fixture: ComponentFixture<AccordionCareerWorkExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionCareerWorkExperienceComponent]
    });
    fixture = TestBed.createComponent(AccordionCareerWorkExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
