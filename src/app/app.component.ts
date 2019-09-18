import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Moment } from 'moment';
import * as moment from 'moment-timezone';

import { OwlDateTimeComponent } from '../../projects/picker/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('date_range_component', { static: true })
  date_range_component: OwlDateTimeComponent<AppComponent>;
  public selectedMoments: Moment[] = [
    moment('2019-03-11T08:00:00+11:00').tz('Australia/Sydney'),
    moment('2019-03-11T15:00:00+11:00').tz('Australia/Sydney')
  ];

  open_once = false;

  ngAfterViewInit() {
    /*
    if (!this.open_once) {
        this.date_range_component.open();
        this.open_once = true;
    }
    */
  }
}
