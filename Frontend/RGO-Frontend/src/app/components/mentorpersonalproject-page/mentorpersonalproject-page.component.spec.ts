import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorpersonalprojectPageComponent } from './mentorpersonalproject-page.component';

describe('MentorpersonalprojectPageComponent', () => {
  let component: MentorpersonalprojectPageComponent;
  let fixture: ComponentFixture<MentorpersonalprojectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MentorpersonalprojectPageComponent]
    });
    fixture = TestBed.createComponent(MentorpersonalprojectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
