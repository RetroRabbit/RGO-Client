import { TestBed } from '@angular/core/testing';

import { UserstacksService } from './userstacks.service';

describe('UserstacksService', () => {
  let service: UserstacksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserstacksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
