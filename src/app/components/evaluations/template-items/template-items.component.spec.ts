import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateItemsComponent } from './template-items.component';

describe('TemplateItemsComponent', () => {
  let component: TemplateItemsComponent;
  let fixture: ComponentFixture<TemplateItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateItemsComponent]
    });
    fixture = TestBed.createComponent(TemplateItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
