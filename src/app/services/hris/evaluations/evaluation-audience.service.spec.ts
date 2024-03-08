import { TestBed } from '@angular/core/testing';

import { EvaluationAudienceService } from './evaluation-audience.service';

describe('EvaluationAudienceService', () => {
  let service: EvaluationAudienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationAudienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
