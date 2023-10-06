import { TestBed } from '@angular/core/testing';

import { EvaluationTemplateItemService } from './evaluation-template-item.service';

describe('EvaluationTemplateItemService', () => {
  let service: EvaluationTemplateItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationTemplateItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
