import { Component, ViewChild } from '@angular/core';

import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { OwlDateTimeComponent } from 'picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @ViewChild('date_range_component', { static: true })
  dateTimeComponent: OwlDateTimeComponent<AppComponent>;
  public selectedMoments: Moment[] = [
    moment('2019-03-11T08:00:00+11:00').tz('Australia/Sydney'),
    moment('2019-03-11T15:00:00+11:00').tz('Australia/Sydney')
  ];
}
