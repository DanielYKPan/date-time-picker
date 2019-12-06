import {Component, Input, OnInit} from '@angular/core';
import {OwlTimerComponent} from '../timer.component';

@Component({
  selector: 'owl-timepicker-slider',
  templateUrl: './timepicker-slider.component.html',
  styleUrls: ['./timepicker-slider.component.scss']
})
export class TimepickerSliderComponent<T> extends OwlTimerComponent<T> implements OnInit {
}
