import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoverViewportComponent } from './rover-viewport.component';

describe('RoverViewportComponent', () => {
  let component: RoverViewportComponent;
  let fixture: ComponentFixture<RoverViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoverViewportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoverViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
