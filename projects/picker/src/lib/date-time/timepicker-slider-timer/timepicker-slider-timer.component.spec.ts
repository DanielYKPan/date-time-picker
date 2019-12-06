import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerSliderTimerComponent } from './timepicker-slider-timer.component';

describe('TimepickerSliderTimerComponent', () => {
  let component: TimepickerSliderTimerComponent;
  let fixture: ComponentFixture<TimepickerSliderTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerSliderTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerSliderTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
