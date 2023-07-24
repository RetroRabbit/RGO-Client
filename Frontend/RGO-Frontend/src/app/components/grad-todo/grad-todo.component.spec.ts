import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradTodoComponent } from './grad-todo.component';

describe('GradTodoComponent', () => {
  let component: GradTodoComponent;
  let fixture: ComponentFixture<GradTodoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradTodoComponent]
    });
    fixture = TestBed.createComponent(GradTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
