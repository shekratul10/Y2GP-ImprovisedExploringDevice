import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:
      [
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        RouterOutlet
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'IED Dashboard'`, () => {
    expect(component.title).toEqual('IED Dashboard');
  });
});
