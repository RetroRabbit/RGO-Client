import { TestBed } from '@angular/core/testing';

import { EvaluationTemplateService } from './evaluation-template.service';

describe('EvaluationTemplateService', () => {
  let service: EvaluationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
