import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvDocumentComponent } from './cv-document.component';

describe('CvDocumentComponent', () => {
  let component: CvDocumentComponent;
  let fixture: ComponentFixture<CvDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CvDocumentComponent]
    });
    fixture = TestBed.createComponent(CvDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
