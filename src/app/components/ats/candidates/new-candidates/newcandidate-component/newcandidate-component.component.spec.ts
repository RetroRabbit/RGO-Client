import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcandidateComponentComponent } from './newcandidate-component.component';

describe('NewcandidateComponentComponent', () => {
  let component: NewcandidateComponentComponent;
  let fixture: ComponentFixture<NewcandidateComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewcandidateComponentComponent]
    });
    fixture = TestBed.createComponent(NewcandidateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
