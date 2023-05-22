import { TestBed } from '@angular/core/testing';

import { RoverDataService } from './rover-data.service';

describe('RoverDataService', () => {
  let service: RoverDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoverDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
