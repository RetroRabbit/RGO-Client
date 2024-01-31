import { TestBed } from '@angular/core/testing';
import { EmployeeEvaluationsRatingService } from './employee-evaluations-rating.service';



describe('EmployeeEvaluationsRatingService', () => {
  let service: EmployeeEvaluationsRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeEvaluationsRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
