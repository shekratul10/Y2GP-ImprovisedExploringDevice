import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RoverDataService } from './rover-data.service';

describe('RoverDataService', () => {
  let service: RoverDataService;
  let httpClient = HttpClient; 
  let httpTestingController = HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
    });
    service = TestBed.inject(RoverDataService);

    TestBed.inject(httpClient);
    TestBed.inject(httpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
