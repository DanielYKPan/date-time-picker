/**
 * date-panel.component
 */

import {
    Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
import { PickerService } from './picker.service';

@Component({
    selector: 'dialog-date-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './date-panel.component.html',
    styleUrls: ['./date-panel.component.scss'],
})
export class DatePanelComponent implements OnInit {

    @Input() public selectedMoment: Moment;
    @Output() public onCancelDialog = new EventEmitter<boolean>();
    @Output() public onConfirm = new EventEmitter<boolean>();

    public theme: string;
    public dialogType: DialogType;
    public now: Moment;
    public moment: Moment;
    public calendarDays: Moment[];
    public dayNames: string[];
    public monthList: string[];
    public yearList: number[] = [];
    public mode: 'popup' | 'dropdown' | 'inline';
    public minMoment: Moment;
    public maxMoment: Moment;
    public prevMonthDisabled: boolean;
    public nextMonthDisabled: boolean;

    private locale: string;

    constructor( private service: PickerService ) {
    }

    public ngOnInit() {

        this.locale = this.service.dtLocale;
        this.theme = this.service.dtTheme;
        this.dialogType = this.service.dtDialogType;
        this.mode = this.service.dtMode;

        // set moment locale (default is en)
        moment.locale(this.locale);

        // set week days name array
        this.dayNames = moment.weekdaysShort(true);
        // set month name array
        this.monthList = moment.monthsShort();

        this.now = moment();
        this.moment = this.service.moment;
        this.minMoment = this.service.minMoment;
        this.maxMoment = this.service.maxMoment;
        this.generateCalendar();
    }

    public prevMonth(): void {
        if(!this.prevMonthDisabled) {
            this.moment = this.moment.clone().subtract(1, 'M');
            this.generateCalendar();
        }
    }

    public nextMonth(): void {
        this.moment = this.moment.clone().add(1, 'M');
        this.generateCalendar();
    }

    public selectMonth( month: string ): void {
        this.moment = this.moment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Month);
        return;
    }

    public selectYear( year: number ): void {
        this.moment = this.moment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Year);
        return;
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
            return;
        }

        this.dialogType = type;
        if (type === DialogType.Year) {
            this.generateYearList();
        }
        return;
    }

    public generateYearList( param?: string ): void {
        let start;

        if (param === 'prev') {
            start = this.yearList[0] - 9;
        } else if (param === 'next') {
            start = this.yearList[8] + 1;
        } else {
            start = +this.moment.clone().subtract(4, 'y').format('YYYY');
        }

        for (let i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    }

    public select( moment: Moment ): void {
        if (this.selectedMoment &&
            this.selectedMoment.clone().startOf('date') === moment
            || (this.minMoment && this.minMoment.isAfter(moment, 'day'))
            || (this.maxMoment && this.maxMoment.isBefore(moment, 'day'))) {
            return;
        }

        if (moment.year() !== this.moment.year() ||
            moment.month() !== this.moment.month()) {
            this.moment = moment.clone();
            this.generateCalendar();
        }
        this.service.setDate(moment);
    }

    public selectToday(): void {
        let moment = this.moment.clone()
            .year(this.now.year())
            .month(this.now.month())
            .dayOfYear(this.now.dayOfYear());

        if((this.minMoment && this.minMoment.isAfter(moment, 'day'))
            || (this.maxMoment && this.maxMoment.isBefore(moment, 'day'))){
            return;
        }
        this.service.setDate(moment);
    }

    public cancelDialog(): void {
        this.onCancelDialog.emit(true);
        return;
    }

    public confirm(): void {
        this.onConfirm.emit(true);
        return;
    }

    private generateCalendar(): void {
        this.calendarDays = [];
        let start = 0 - (this.moment.clone().startOf('month').day() + (7 - moment.localeData().firstDayOfWeek())) % 7;
        let end = 41 + start; // iterator ending point

        for (let i = start; i <= end; i += 1) {
            let day = this.moment.clone().startOf('month').add(i, 'days');
            this.calendarDays.push(day);
        }

        this.prevMonthDisabled = this.minMoment &&
            (this.minMoment.year() > this.moment.year() ||
            this.minMoment.month() >= this.moment.month());
        this.nextMonthDisabled = this.maxMoment &&
            (this.maxMoment.year() < this.moment.year() ||
            this.maxMoment.month() <= this.moment.month());
    }
}

