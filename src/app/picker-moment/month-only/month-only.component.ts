import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OwlDateTimeComponent } from 'ng-pick-datetime';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
    selector: 'app-month-only',
    templateUrl: './month-only.component.html',
    styleUrls: ['./month-only.component.scss'],
})
export class MonthOnlyComponent implements OnInit {

    public date = new FormControl(moment());

    constructor() {
    }

    ngOnInit() {
    }

    chosenYearHandler( normalizedYear: Moment ) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler( normalizedMonth: Moment, datepicker: OwlDateTimeComponent<Moment> ) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();
    }
}
