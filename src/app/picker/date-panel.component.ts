/**
 * date-panel.component
 */

import {
    Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges,
    SimpleChanges
} from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';

@Component({
    selector: 'dialog-date-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './date-panel.component.html',
    styleUrls: ['./date-panel.component.scss']
})
export class DatePanelComponent implements OnInit, OnChanges {

    @Input() moment: Moment;
    @Input() now: Moment;
    @Input() dialogType: DialogType;
    @Input() locale: string;
    @Input() selectedMoment: Moment;
    @Input() theme: string;
    @Output() onSelectDate = new EventEmitter<Moment>();
    @Output() onCancelDialog = new EventEmitter<boolean>();
    @Output() onConfirm = new EventEmitter<boolean>();

    private calendarDays: Moment[];
    private dayNames: string[];
    private monthList: string[];
    private yearList: number[] = [];

    constructor() {
    }

    public ngOnInit() {
        // set moment locale (default is en)
        moment.locale(this.locale);

        // set week days name array
        this.dayNames = moment.weekdaysShort(true);
        // set month name array
        this.monthList = moment.monthsShort();

        this.generateCalendar();
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (changes['selectedMoment'] && !changes['selectedMoment'].isFirstChange() &&
            (this.selectedMoment.year() !== this.moment.year() ||
            this.selectedMoment.month() !== this.moment.month())) {
            this.moment = this.selectedMoment.clone();
            this.generateCalendar();
        }
    }

    public prevMonth(): void {
        this.moment = this.moment.clone().subtract(1, 'M');
        this.generateCalendar();
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
            this.selectedMoment.clone().startOf('date') === moment) {
            return;
        }
        this.onSelectDate.emit(moment);
    }

    public selectToday(): void {
        let moment = this.moment.clone()
            .year(this.now.year())
            .month(this.now.month())
            .dayOfYear(this.now.dayOfYear());
        this.onSelectDate.emit(moment);
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
    }
}

