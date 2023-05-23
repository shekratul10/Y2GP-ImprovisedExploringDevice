import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule , HttpTestingController} from '@angular/common/http/testing';
import { TelemetryComponent } from './telemetry.component';
import { HttpClient } from '@angular/common/http';

describe('TelemetryComponent', () => {
  let component: TelemetryComponent;
  let fixture: ComponentFixture<TelemetryComponent>;
  let httpClient = HttpClient; 
  let httpTestingController = HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ TelemetryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(httpClient);
    TestBed.inject(httpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display LoS if #LoS is true', () => {
    expect(component.roverData.LoS).withContext('Off when initialised').toBe(true);
    const TelemetryElement:HTMLElement = fixture.nativeElement;
    expect(TelemetryElement.querySelector('h3')?.textContent).toEqual('LoS');
  });
  it('should show telemetry data when #LoS is false', () => {
    component.roverData.LoS = false;
    fixture.autoDetectChanges()
    const TelemetryElement:HTMLElement = fixture.nativeElement;
    expect(TelemetryElement.querySelector('h3')?.textContent).not.toEqual('LoS');
  });
});
