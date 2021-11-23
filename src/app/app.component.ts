import { Component, ViewChild } from '@angular/core';

import { OwlDateTimeComponent } from 'picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('date_range_component', { static: true })
  dateTimeComponent: OwlDateTimeComponent<AppComponent>;
  public selectedDate: Date[] = [
    new Date('2019-03-11T08:00:00+11:00'),
    new Date('2019-03-11T15:00:00+11:00')
  ];
}
