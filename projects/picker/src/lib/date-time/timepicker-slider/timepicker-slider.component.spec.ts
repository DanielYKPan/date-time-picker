import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerSliderComponent } from './timepicker-slider.component';

describe('TimepickerSliderComponent', () => {
  let component: TimepickerSliderComponent;
  let fixture: ComponentFixture<TimepickerSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
