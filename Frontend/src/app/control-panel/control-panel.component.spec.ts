import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelComponent } from './control-panel.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ControlPanelComponent', () => {
  let component: ControlPanelComponent;
  let fixture: ComponentFixture<ControlPanelComponent>;
  let httpClient = HttpClient; 
  let httpTestingController = HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ ControlPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(httpClient);
    TestBed.inject(httpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
