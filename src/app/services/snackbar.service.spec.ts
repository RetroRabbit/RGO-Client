import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';

describe('SnackbarServiceService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
